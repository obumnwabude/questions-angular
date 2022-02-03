import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  options = ['A', 'B', 'C', 'D'];
  questionForm: FormGroup = new FormGroup({
    value: new FormControl('', Validators.required),
    correct: new FormControl(this.options[0], Validators.required),
    options: new FormArray(
      this.options.map(
        (o) =>
          new FormGroup({
            index: new FormControl(o, Validators.required),
            value: new FormControl('', Validators.required)
          })
      )
    )
  });
  get optionControls() {
    return (this.questionForm.get('options') as FormArray)
      .controls as FormGroup[];
  }

  constructor(private snackBar: MatSnackBar) {}

  onSubmit(): void {
    if (this.questionForm.valid) {
      console.log(this.questionForm.value);
      this.snackBar.open('Question successfully submitted.', '', {
        panelClass: ['snackbar-success']
      });
    } else {
      this.snackBar.open('Please fill all the required fields.', '', {
        panelClass: ['snackbar-error']
      });
    }
  }
}
