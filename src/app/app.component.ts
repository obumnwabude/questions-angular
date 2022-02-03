import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { doc, Firestore, onSnapshot, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading = false;
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
  questionRef = doc(this.firestore, 'questions', 'question');
  get optionControls() {
    return (this.questionForm.get('options') as FormArray)
      .controls as FormGroup[];
  }

  constructor(private firestore: Firestore, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    onSnapshot(this.questionRef, (question) =>
      this.questionForm.setValue(question.data() as any)
    );
  }

  async onSubmit(): Promise<void> {
    if (this.questionForm.valid) {
      try {
        this.loading = true;
        await setDoc(this.questionRef, this.questionForm.value, {
          merge: true
        });
        this.snackBar.open('Question successfully submitted.', '', {
          panelClass: ['snackbar-success']
        });
      } catch (error) {
        this.snackBar.open(`${error}`, '', {
          panelClass: ['snackbar-error']
        });
      } finally {
        this.loading = false;
      }
    } else {
      this.snackBar.open('Please fill all the required fields.', '', {
        panelClass: ['snackbar-error']
      });
    }
  }
}
