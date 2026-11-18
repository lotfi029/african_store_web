import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, LOCALE_ID, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { STORE_API_URL } from '../../core/api/store-api-url';
import { SHOWCASE } from '../../core/showcase/showcase';
import { BottomNav, currentItem } from './bottom-nav';

@Component({ template: '' })
class Blank {}

async function mount(url: string, showcase = false) {
  TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      provideRouter([
        { path: '', component: Blank },
        { path: 'cart', component: Blank },
        { path: 'p/:slug', component: Blank },
      ]),
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: STORE_API_URL, useValue: 'https://store-api.test/v1' },
      { provide: LOCALE_ID, useValue: 'ar' },
      { provide: SHOWCASE, useValue: showcase },
    ],
  });
  const f = TestBed.createComponent(BottomNav);
  await TestBed.inject(Router).navigateByUrl(url);
  f.detectChanges();
  await f.whenStable();
  return f.nativeElement as HTMLElement;
}

describe('BottomNav', () => {
  it('maps a URL to the current item', () => {
    expect(currentItem('/')).toBe('home');
    expect(currentItem('/?category=water#projects')).toBe('home');
    expect(currentItem('/cart')).toBe('cart');
    expect(currentItem('/checkout')).toBe('cart');
    expect(currentItem('/account/donations')).toBe('account');
    expect(currentItem('/p/well')).toBeNull();
  });

  it('renders the five items in a labelled nav, with aria-current on the page', async () => {
    const el = await mount('/cart');
    const nav = el.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('التنقل السفلي');
    const items = [...nav.querySelectorAll('.it')].map((i) => i.textContent?.trim());
    expect(items).toEqual(['الرئيسية', 'الأقسام', 'البحث', 'السلة', 'حسابي']);
    const current = nav.querySelectorAll('[aria-current="page"]');
    expect(current.length).toBe(1);
    expect(current[0].textContent?.trim()).toBe('السلة');
  });

  it('showcase mode hides السلة and حسابي', async () => {
    const el = await mount('/', true);
    const items = [...el.querySelectorAll('.it')].map((i) => i.textContent?.trim());
    expect(items).toEqual(['الرئيسية', 'الأقسام', 'البحث']);
  });

  it('«البحث» focuses the header search field', async () => {
    const el = await mount('/');
    const input = document.createElement('input');
    input.id = 'hdr-q';
    document.body.appendChild(input);
    try {
      (el.querySelectorAll('button.it')[1] as HTMLButtonElement).click();
      expect(document.activeElement).toBe(input);
    } finally {
      input.remove();
    }
  });

  it('«الأقسام» focuses the current category tab', async () => {
    const el = await mount('/');
    const bar = document.createElement('nav');
    bar.id = 'cats';
    bar.innerHTML = '<a href="/">all</a><a href="/?category=x" aria-current="page">x</a>';
    document.body.appendChild(bar);
    try {
      (el.querySelectorAll('button.it')[0] as HTMLButtonElement).click();
      await new Promise((r) => setTimeout(r));
      expect(document.activeElement).toBe(bar.querySelector('[aria-current="page"]'));
    } finally {
      bar.remove();
    }
  });
});
