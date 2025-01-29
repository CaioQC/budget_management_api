/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import BudgetSummariesController from '#controllers/budget_summaries_controller'
import ExpensesController from '#controllers/expenses_controller'
import RevenuesController from '#controllers/revenues_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.group(()=> {
  router.resource("/revenues", RevenuesController).apiOnly()
  router.resource("/expenses", ExpensesController).apiOnly()
  router.get("/revenues/:year/:month", [RevenuesController, "getYearAndMonth"])
  router.get("/expenses/:year/:month", [ExpensesController, "getYearAndMonth"])
  router.get("/summary/:year/:month", [BudgetSummariesController, "summary"])
  router.post("/logout", [AuthController, "logout"])
}).middleware(middleware.auth())

router.post("/login", [AuthController, "login"])
