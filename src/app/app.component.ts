import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  private destroyRef = inject(DestroyRef)
  click = signal<number>(0)
  timerCount = signal<number>(0)
  click$ = toObservable(this.click)

  interval$ = interval(1000)
  intervalSignal = toSignal(this.interval$, {initialValue:0})

  customInterval$ = new Observable((subscriber)=> {
    let timesExecuted = 0;
    //subscriber.error()
    const id = setInterval(()=>{
      if(timesExecuted > 5)
      {
          clearInterval(id);
          subscriber.complete()
          return
      }
      console.log('emitting new value')
      subscriber.next({message:'New Value'});
      timesExecuted++;
    },2000)
  })
  
  //creating your own Observable



  constructor()
  {
    // effect(()=>{
    //   console.log("clicked count",this.click())
    // })
    
  }
  ngOnInit()
  {
    //OBSERVABLES
    // const intervalObservable = interval(3000).subscribe({
    //   next:(val)=>console.log(val),
    //   complete:()=>console.log('hi'),
    //   error:()=>console.log('error ')
    // })

    //OPERATORS WITH OBSERVABLES .pipe()
    const intervalObservable = interval(1000).pipe(
      map((val: number)=>val*1),
    ).subscribe({
     // next:(val)=>console.log(val),
      complete:()=>console.log('hi'),
      error:()=>console.log('error ')
    })

    //console.log('interval:',interval(1000).subscribe())

    this.destroyRef.onDestroy(()=>{
        intervalObservable.unsubscribe()
      })

      this.click$.subscribe({
        next:((val)=> console.log("clicked count",this.click()))
      }) //instead of using effect to listen to signal changes we can use this instead


      this.customInterval$.subscribe({
        next:(val) =>console.log(val),
        complete:()=>console.log('completed')
      })
  }
  intervalID = setInterval(()=>{
       // this.timerCount.update((prev)=>prev+1)
      },1000)

  onClick(){
    this.click.update((prev)=>prev+1)
  }
}
