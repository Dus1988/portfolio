import { Directive, NgZone, AfterViewInit, OnDestroy } from "@angular/core";

import { CdkDropList } from "@angular/cdk/drag-drop";

import { Subscription } from "rxjs";

import { Cancelable, debounce } from "lodash";

@Directive({
  selector: "[dropListScroller]"
})
export class DropListScrollerDirective implements AfterViewInit, OnDestroy {
  private animationFrame: number | undefined;

  private debouncedAdjustItemPositions: (position: {
    x: number;
    y: number;
  }) => void | Cancelable;

  private readonly _subscriptions = new Subscription();

  constructor(
    private readonly _elementRef: CdkDropList,
    private readonly _zone: NgZone
  ) {
    this.debouncedAdjustItemPositions = this.debounceReduce(
      (position: { x: number; y: number }) =>
        this.adjustItemPositions(position),
      20,
      (acc, position) => {
        acc = acc || position[0];
        acc.x += position[0].x;
        acc.y += position[0].y;

        return acc;
      }
    );
  }

  public ngAfterViewInit(): void {
    if (this._elementRef.disabled) {
        return;
    }
    this._elementRef._draggables.forEach(item => {
      this._subscriptions.add(
        item._dragRef.moved.subscribe(event => {
          this.onDragMoved(event.pointerPosition);
        })
      );
      this._subscriptions.add(
        item._dragRef.ended.subscribe(() => this.onDragEnded())
      );
    });
  }

  public ngOnDestroy(): void {
      if (this._subscriptions) this._subscriptions.unsubscribe();
  }

  private onDragMoved(position: { x: number; y: number }): void {
    this.cancelScroll();

    this.animationFrame = requestAnimationFrame(() => this.scroll(position));
  }

  private onDragEnded(): void {
    this.cancelScroll();
  }

  private scroll(position: { x: number; y: number }): void {
    this._zone.runOutsideAngular(() => {
      this.cancelScroll();

      const { x, y } = position;
      const speed = 5;

      const scrollContainer = this._elementRef.element.nativeElement;
      const scrollTop = scrollContainer.scrollTop;
      const scrollLeft = scrollContainer.scrollLeft;
      const scrollHeight = scrollContainer.scrollHeight;
      const scrollWidth = scrollContainer.scrollWidth;
      const clientRect = scrollContainer.getBoundingClientRect();
      let scrollx = 0;
      let scrolly = 0;

      if (x < clientRect.left && scrollLeft !== 0) {
        scrollx = -Math.trunc(speed * Math.exp((clientRect.left - x) / 50));

        // ensure left scroll boundary isn't crossed
        if (scrollLeft + scrollx < 0) {
          scrollx = -scrollLeft;
        }
      } else if (
        x > clientRect.right &&
        scrollLeft <= scrollWidth - clientRect.width
      ) {
        scrollx = Math.trunc(speed * Math.exp((x - clientRect.right) / 50));

        // ensure right scroll boundary isn't crossed
        if (scrollLeft + scrollx > scrollWidth - clientRect.width) {
          scrollx = scrollWidth - clientRect.width - scrollLeft;
        }
      }

      if (y < clientRect.top && scrollTop !== 0) {
        scrolly = -Math.trunc(speed * Math.exp((clientRect.top - y) / 50));

        // ensure top scroll boundary isn't crossed
        if (scrollTop + scrolly < 0) {
          scrolly = -scrollTop;
        }
      } else if (
        y > clientRect.bottom &&
        scrollTop <= scrollHeight - clientRect.height
      ) {
        scrolly = Math.trunc(speed * Math.exp((y - clientRect.bottom) / 50));

        // ensure right scroll boundary isn't crossed
        if (scrollTop + scrolly > scrollHeight - clientRect.height) {
          scrolly = scrollHeight - clientRect.height - scrollTop;
        }
      }

      if (scrollx !== 0 || scrolly !== 0) {
        this._elementRef.element.nativeElement.scrollLeft += scrollx;
        this._elementRef.element.nativeElement.scrollTop += scrolly;

        this.debouncedAdjustItemPositions({ x: scrollx, y: scrolly });

        this.animationFrame = requestAnimationFrame(() =>
          this.scroll(position)
        );
      }
    });
  }

  private cancelScroll() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
  }

  private adjustItemPositions(position: { x: number; y: number }): void {
    const dropListRef: any = this._elementRef._dropListRef;
    const { x, y } = position;

    dropListRef._itemPositions.forEach(it => {
      it.clientRect.left -= x;
      it.clientRect.right -= x;
      it.clientRect.top -= y;
      it.clientRect.bottom -= y;
    });
  }

  private debounceReduce(func, wait, combine) {
    let allArgs; // accumulator for args across calls

    // normally-debounced fn that we will call later with the accumulated args
    const wrapper = debounce(() => {
      const args = allArgs;
      allArgs = undefined;
      func(args);
    }, wait);

    // what we actually return is this function which will really just add the new args to
    // allArgs using the combine fn
    return (...args) => {
      allArgs = combine(allArgs, [...args]);
      wrapper();
    };
  }
}
