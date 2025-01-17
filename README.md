# Finance Tracker

Finance Tracker is a web application to help you manage your savings and set financial goals.

## Table of Contents

- [A Brief Overview](#Overview)
- [Installation](#installation)
- [Usage](#usage)
- [Available Scripts](#available-scripts)
- [Custom Hooks and Advanced React Methodologies](#custom-hooks-and-advanced-react-methodologies)
- [Contributing](#contributing)
- [License](#license)

## Overview

This is a finance tracker App that helps the user track their income and expense. Also user can set saving goals and add contribution they make monthly to reach the said saving goal.

1. **Dashboard:**
   This is the home of the app. Intially it shows dummy data that is intialzied in respective slices of income, expense and savings. The user can erase this data thru the dashbord with the help of a button. It displays the user's toatl income, expense and savings. Also user can see the current months comparision and overall comparison of income, expense and savings throught the months.

2. **Income:**
   Here the user can input their income based on category and by selecting a date. The user can see the monthly income distribution by category as well as transcation they have entered. There is also a bar graph that shows how much income the user has made each month.

3. **Expense:**
   This is similar to income page except, the user can input data for expenses they make based on category. They can see their expense transactions, category comparison and monthly expense each month.

4. **Savigns:**
   In the savings, the user can set a saving goal and see if they have reached the said goal. Based on that the user may see a congratulatory message or a message that tells them the required amount needed to save to reach their goal. There is also a pie chart that shows income vs savings comparison for the month and a bar graph that shows the users monthly saving contribution.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   ```

   Replace `<repository-url>` with the actual URL of your repository.

2. **Navigate to the Project Directory:**

   ```bash
   cd finance-tracker
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

4. **Set Up Environment Variables:**
   Create a `.env` file in the root directory of your project and add any necessary environment variables. For example:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

## Usage

1. **Start the Development Server:**

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

2. **Open the Application:**
   Open your web browser and navigate to `http://localhost:3000` to view the application.

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `yarn dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm test` or `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Custom Hooks and Advanced React Methodologies

### Custom Hooks

This project uses custom hooks to encapsulate and reuse logic across different components. The custom hooks are located in the `src/hooks` directory.

#### `useAppDispatch` and `useAppSelector`

These hooks are used to interact with the Redux store.

- `useAppDispatch`: A typed version of the `useDispatch` hook from `react-redux`.
- `useAppSelector`: A typed version of the `useSelector` hook from `react-redux`.

Example usage:

```typescript
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

const dispatch = useAppDispatch();
const incomes = useAppSelector((state) => state.income.incomeItems);
```

### Advanced React Methodologies

#### useMemo

The `useMemo` hook is used to memoize expensive calculations and avoid unnecessary re-renders.

Example usage:

```typescript
const totalSavingsByMonth = useMemo(() => {
  return (month: string) => {
    return savings
      .filter((saving) => saving.month === month)
      .reduce((sum, curr) => sum + curr.amount, 0);
  };
}, [savings]);
```

#### useState

The `useState` hook is used to manage local state within functional components.

Example usage:

```typescript
const [newGoal, setNewGoal] = useState<string>("");
const [selectedMonth, setSelectedMonth] = useState<string>("January");
```

#### useEffect

The `useEffect` hook is used to perform side effects in functional components. This project does not currently use `useEffect`, but it is a common hook for handling side effects such as data fetching and subscriptions.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.
