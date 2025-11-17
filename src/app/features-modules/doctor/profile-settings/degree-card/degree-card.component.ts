import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DegreeService } from 'src/app/api/services';

@Component({
  selector: 'app-degree-card',
  templateUrl: './degree-card.component.html',
  styleUrls: ['./degree-card.component.scss'],
})
export class DegreeCardComponent implements OnInit {
  @Input() degreeData: any;
  @Output() editDegree = new EventEmitter<any>();
  degreeList: any = [];
  degreename: any = '';
  constructor(private degreeService: DegreeService) {}
  ngOnInit(): void {
    this.degreeService.getList().subscribe((res) => {
      this.degreeList = res;
      this.getDegreeName(res);
    });
  }
  getDegreeName(res: any): void {
    this.degreename = res.find(
      (e: any) => e.id == this.degreeData.degreeId
    )?.degreeName;
  }
}
