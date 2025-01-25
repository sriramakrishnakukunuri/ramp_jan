import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  submitRedirect(){
    this.router.navigateByUrl('/veiw-program-creation');
  }
}
