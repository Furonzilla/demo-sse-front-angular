import { Component, OnInit } from '@angular/core';
import { Observer, Subscription } from 'rxjs';
import { Wilder } from 'src/app/models/wilders.model';
import { WildersService } from 'src/app/services/wilders.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  public wilders: Wilder[] = [];
  private wildersObserver = {
    next: (data: any) => {
      this.wilders = JSON.parse(data.data).content;
    },
  };
  private wildersSubscription: Subscription;
  public connectionState: boolean = false;
  private connectionStateObserver = {
    next: (connectionStateData: number) => {
      if (connectionStateData === EventSource.OPEN) {
        this.connectionState = true;
      } else if (
        connectionStateData === EventSource.CLOSED ||
        connectionStateData === EventSource.CONNECTING
      ) {
        this.connectionState = false;
      }
    },
  };

  constructor(private wildersService: WildersService) {
    this.wildersSubscription = this.getWildersSubscription();
  }

  ngOnInit(): void {
    this.wildersService.connectionState$.subscribe(
      this.connectionStateObserver
    );
  }

  private getWildersSubscription(): Subscription {
    return this.wildersService.getWildersSSE().subscribe(this.wildersObserver);
  }

  public toggleWilderSubscription(): void {
    if (this.wildersSubscription.closed) {
      this.wildersSubscription = this.getWildersSubscription();
    } else {
      this.wildersSubscription.unsubscribe();
    }
  }
}
