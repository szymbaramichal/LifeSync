import { Component } from '@angular/core';
import { ExpensesTopBar } from "../expenses-top-bar/expenses-top-bar";
import { ExpensesList } from "../expenses-list/expenses-list";

@Component({
  selector: 'app-expenses-dashboard',
  imports: [ExpensesTopBar, ExpensesList],
  templateUrl: './expenses-dashboard.html',
  styleUrl: './expenses-dashboard.css',
})
export class ExpensesDashboard {

}
