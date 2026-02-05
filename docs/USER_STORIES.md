# User Stories & Acceptance Criteria

## 1. Checkout Flow
**As a** new user  
**I want to** subscribe to the "Pro" plan  
**So that** I can access premium features of the application.

### Acceptance Criteria

#### Step 1: Account Creation
- [ ] **Data Entry**: User validates inputs for Name, CPF, Email, and Password.
- [ ] **Legal Consent**: User must check a box agreeing to "Terms of Use" and "Privacy Policy".
- [ ] **Navigation**: The "Next" (Próximo) button remains disabled until the legal consent checkbox is active.
- [ ] **Feedback**: Clicking "Next" transitions the user to the Payment step (currently client-side state change).

#### Step 2: Payment
- [ ] **Plan Display**: The interface validates the selected plan is "Pro (Brother)" with a price of R$ 29,90/month.
- [ ] **Credit Card Entry**: User inputs Credit Card Number, Holder Name, Expiry Date, and CVV.
- [ ] **Visual Feedback**: The credit card preview updates as the user types (if applicable) or fields are clearly distinct.
- [ ] **Submission**: The "Confirm Subscription" (Confirmar Assinatura) button calls the subscription handler (`onSubscribe`).
- [ ] **Completion**: Upon success, visual feedback is provided (e.g., redirect or success message - *implementation detail to be finalized*).

---

## 2. Project Flow
**As a** user  
**I want to** manage my financial projects  
**So that** I can track my progress towards specific financial goals.

### Acceptance Criteria

#### View Project Details
- [ ] **Header**: Displays the active Project Name.
- [ ] **Summary Stats**: Shows the Project Icon, Current Amount (R$), and Target Amount (R$) prominently.
- [ ] **Progress**:
  - [ ] A progress bar visualizes the ratio of Current vs. Target amount.
  - [ ] Percentage is displayed numerically.
  - [ ] A text summary shows the remaining amount needed to reach the goal.

#### Project Actions
- [ ] **Contribute (Aportar)**:
  - [ ] Clicking "Aportar" opens a contribution interface (currently a simulated alert).
- [ ] **Edit (Editar)**:
  - [ ] Clicking "Editar" opens an edit interface (currently a simulated alert).
- [ ] **Delete (Excluir)**:
  - [ ] Clicking "Excluir Projeto" shows a browser confirmation dialog.
  - [ ] Confirming the dialog calls the `onDelete` handler with the correct project ID.
  - [ ] Canceling the dialog takes no action.

---

## 3. Future Improvements Roadmap

### CI/CD Pipeline (GitHub Actions)
To ensure code quality and prevent regressions, the following automated checks will be implemented:
- **Linting**: Run `npm run lint` on every Pull Request.
- **Testing**: Run Unit Tests (`npm run test`) and E2E Tests (Playwright) on every Pull Request.
- **Build**: Verify `npm run build` succeeds before merging.

### Error Tracking
- **Sentry**: Install and configure Sentry to capture frontend runtime errors in production.
