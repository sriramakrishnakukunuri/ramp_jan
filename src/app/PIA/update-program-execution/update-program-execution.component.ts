import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
declare var $: any;
@Component({
  selector: 'app-update-program-execution',
  templateUrl: './update-program-execution.component.html',
  styleUrls: ['./update-program-execution.component.css']
})
export class UpdateProgramExecutionComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    setTimeout(() => {
      new DataTable('#creation-table', {              
      // scrollX: true,
      // scrollCollapse: true,    
      // responsive: true,    
      // paging: true,
      // searching: true,
      // ordering: true,
      scrollY: "415px",     
      scrollX:        true,
      scrollCollapse: true,
      autoWidth:         true,  
      paging:         false,  
      info: false,   
      searching: false,  
      destroy: true, // Ensure reinitialization doesn't cause issues
      });
    }, 500);
  }
  submitRedirect(){
    this.router.navigateByUrl('/veiw-program-creation');
  }
}
