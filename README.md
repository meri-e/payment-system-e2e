# payment-system-e2e
payment-system-e2e is a demo automation framework that showcases best practices in end-to-end testing for payment systems.  It simulates the workflows of a modern checkout system — from adding items to a cart, to processing card payments, to handling refunds — and covers both UI flows and API-level validation

cypress/
  e2e/
  pages/           # Page Object classes for checkout, payment, refund
  fixtures/        # Test data (fake credit cards, user accounts)
  support/         # Custom commands, global hooks
.github/workflows/ # CI pipeline
