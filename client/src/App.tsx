import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

// ------------------------------
// 型定義
// ------------------------------
type Expense = {
  id: number;
  date: string;
  category: string;
  type: '入金' | '出金';
  amount: number;
};

// ------------------------------
// データモック
// ------------------------------
const expenses: Expense[] = [
  { id: 1, date: '2026-02-01', category: '食費', type: '出金', amount: 1200 },
  { id: 2, date: '2026-02-02', category: '交通費', type: '出金', amount: 450 },
  { id: 3, date: '2026-02-03', category: '娯楽', type: '出金', amount: 3000 },
  { id: 4, date: '2026-02-04', category: '給料', type: '入金', amount: 300000 },
  { id: 5, date: '2026-03-01', category: '食費', type: '出金', amount: 1500 },
  { id: 6, date: '2026-03-05', category: '給料', type: '入金', amount: 300000 },
];

// ------------------------------
// Home / About / Contact
// ------------------------------
const Home: React.FC = () => <h1>🏠 Home test</h1>;
const About: React.FC = () => <h1>📘 About</h1>;
const Contact: React.FC = () => <h1>📩 Contact</h1>;

// ------------------------------
// ExpenseRow コンポーネント
// ------------------------------
type ExpenseRowProps = {
  expense: Expense;
  showLink?: boolean;
};

const ExpenseRow: React.FC<ExpenseRowProps> = ({ expense, showLink = false }) => (
  <tr>
    <td>
      {showLink ? <Link to={`/expenses/${expense.id}`}>{expense.date}</Link> : expense.date}
    </td>
    <td>{expense.category}</td>
    <td style={{ color: expense.type === '出金' ? 'red' : 'green' }}>
      ¥{expense.amount}
    </td>
  </tr>
);

// ------------------------------
// ExpenseTable コンポーネント
// ------------------------------
type ExpenseTableProps = {
  expenses: Expense[];
  showLink?: boolean;
};

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, showLink = false }) => (
  <table border={1} cellPadding={5}>
    <thead>
      <tr>
        <th>日付</th>
        <th>カテゴリ</th>
        <th>金額</th>
      </tr>
    </thead>
    <tbody>
      {expenses.map((expense) => (
        <ExpenseRow key={expense.id} expense={expense} showLink={showLink} />
      ))}
    </tbody>
  </table>
);

// ------------------------------
// 月ごとの集計用関数
// ------------------------------
const getMonthKey = (date: string) => date.slice(0, 7); // YYYY-MM形式

const calculateMonthlyTotals = (expenses: Expense[]) => {
  const monthlyTotals: Record<string, { income: number; expense: number }> = {};
  expenses.forEach((e) => {
    const key = getMonthKey(e.date);
    if (!monthlyTotals[key]) monthlyTotals[key] = { income: 0, expense: 0 };
    if (e.type === '入金') monthlyTotals[key].income += e.amount;
    else monthlyTotals[key].expense += e.amount;
  });
  return monthlyTotals;
};

// ------------------------------
// ExpenseList ページ
// ------------------------------
const ExpenseList: React.FC = () => {
  const total = expenses.reduce(
    (sum, e) => (e.type === '入金' ? sum + e.amount : sum - e.amount),
    0
  );

  const monthlyTotals = calculateMonthlyTotals(expenses);

  return (
    <div>
      <h1>👛 家計簿</h1>

      <h2>全履歴</h2>
      <ExpenseTable expenses={expenses} showLink={true} />
      <p>入金・出金の差額: ¥{total}</p>

      <h2>月ごとの集計</h2>
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>月</th>
            <th>入金合計</th>
            <th>出金合計</th>
            <th>差額</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(monthlyTotals).map(([month, { income, expense }]) => (
            <tr key={month}>
              <td>{month}</td>
              <td style={{ color: 'green' }}>¥{income}</td>
              <td style={{ color: 'red' }}>¥{expense}</td>
              <td>¥{income - expense}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ------------------------------
// ExpenseDetailContent コンポーネント
// ------------------------------
type ExpenseDetailContentProps = {
  expense: Expense;
};

const ExpenseDetailContent: React.FC<ExpenseDetailContentProps> = ({ expense }) => (
  <div>
    <h1>📄 詳細情報</h1>
    <p>日付: {expense.date}</p>
    <p>カテゴリ: {expense.category}</p>
    <p>種類: {expense.type}</p>
    <p>金額: ¥{expense.amount}</p>
    <Link to="/expenses">← 一覧に戻る</Link>
  </div>
);

// ------------------------------
// ExpenseDetail ページ
// ------------------------------
const ExpenseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const expense = expenses.find((e) => e.id === Number(id));

  if (!expense) return <p>データが見つかりません</p>;

  return <ExpenseDetailContent expense={expense} />;
};

// ------------------------------
// App コンポーネント（ルーティング設定）
// ------------------------------
const App: React.FC = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/expenses">家計簿</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/expenses" element={<ExpenseList />} />
        <Route path="/expenses/:id" element={<ExpenseDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
