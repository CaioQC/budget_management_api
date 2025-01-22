/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import ExpensesController from '#controllers/expenses_controller'
import RevenuesController from '#controllers/revenues_controller'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.resource("/revenues", RevenuesController).apiOnly()
router.resource("/expenses", ExpensesController).apiOnly()