/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
 import { isPlatformBrowser } from '@angular/common';
 import { Component, Inject, PLATFORM_ID, } from '@angular/core';

 @Component({
   selector: 'ngx-app',
   template: '<router-outlet></router-outlet>',
 })
 export class AppComponent {
   constructor(@Inject(PLATFORM_ID) platformId: Record<string, unknown>) {
     const isBrowser = isPlatformBrowser(platformId);
     if (isBrowser) {
       window.document.getElementById('nb-global-spinner')?.remove();
     }
   }
 }
