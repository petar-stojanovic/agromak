import {Directive, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {DomController} from "@ionic/angular";

@Directive({
  selector: '[appHideHeader]',
  standalone: true,
})
export class HideHeaderDirective implements OnInit {

  @Input('appHideHeader') header: any;
  private headerHeight = 44;
  private lastScrollTop = 44;
  private SCROLL_THRESHOLD = 10;

  constructor(private renderer: Renderer2,
              private domCtrl: DomController) {
  }

  ngOnInit() {
    this.header = this.header.el;
    this.domCtrl.read(() => {
      this.headerHeight = this.header.clientHeight;
      this.lastScrollTop = this.header.clientHeight;
    });
  }

  @HostListener('ionScroll', ['$event']) onContentScroll($event: any) {
    const scrollTop = $event.detail.scrollTop;

    if (Math.abs(scrollTop - this.lastScrollTop) > this.SCROLL_THRESHOLD && scrollTop > this.headerHeight) {
      if (scrollTop > this.lastScrollTop) {
        this.renderer.setStyle(this.header, 'top', `-${this.headerHeight}px`);
      } else {
        this.renderer.setStyle(this.header, 'top', '0');
      }

      this.renderer.setStyle(this.header, 'transition', `top 400ms`);
      this.lastScrollTop = scrollTop;
    }
  }
}
