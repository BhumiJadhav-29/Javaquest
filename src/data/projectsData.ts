import { Project } from "../types";

export const PROJECTS: Project[] = [
  {
    id: "proj_calculator",
    title: "Java Console Calculator",
    category: "Java Beginner",
    difficulty: "Beginner",
    estimatedHours: 2,
    xpReward: 100,
    description: "Build a robust calculator supporting addition, subtraction, multiplication, and division with error handling for division by zero.",
    requirements: [
      "Support standard arithmetic operators (+, -, *, /)",
      "Safely guard against division by zero with friendly feedback",
      "Format output cleanly with decimals",
    ],
    conceptsUsed: ["Variables", "Methods", "Switch Statements", "Scanner / I/O", "Conditions"],
    steps: [
      {
        id: "step_1",
        title: "Step 1: Define the Calculation Method",
        instructions: "Create a static method `calculate(double a, double b, char op)` that performs the operation based on `op`.",
        codeHint: "switch (op) { case '+': return a + b; ... }",
      },
      {
        id: "step_2",
        title: "Step 2: Division by Zero Guard",
        instructions: "If `op == '/'` and `b == 0`, handle it cleanly rather than crashing.",
        codeHint: "if (b == 0) { System.out.println(\"Cannot divide by zero\"); return 0; }",
      },
      {
        id: "step_3",
        title: "Step 3: Run Test Suite",
        instructions: "Execute calculations for 12.5 + 7.5 and 20 / 4 and print results.",
        codeHint: "System.out.println(\"Result: \" + calculate(12.5, 7.5, '+'));",
      },
    ],
    starterCode: `public class CalculatorProject {
    public static double calculate(double a, double b, char op) {
        // Implement calculator logic:
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': 
                if (b == 0) {
                    System.out.println("Error: Division by zero!");
                    return 0;
                }
                return a / b;
            default:
                return 0;
        }
    }

    public static void main(String[] args) {
        System.out.println("Result: " + calculate(12.5, 7.5, '+'));
    }
}`,
    solutionCode: `public class CalculatorProject {
    public static double calculate(double a, double b, char op) {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': 
                if (b == 0) {
                    System.out.println("Error: Division by zero!");
                    return 0;
                }
                return a / b;
            default:
                return 0;
        }
    }

    public static void main(String[] args) {
        System.out.println("Result: " + calculate(12.5, 7.5, '+'));
    }
}`,
    testCases: [
      { expectedOutput: "Result: 20.0", description: "Calculates 12.5 + 7.5 = 20.0" },
    ],
  },
  {
    id: "proj_atm",
    title: "ATM Banking System Simulation",
    category: "Java Intermediate",
    difficulty: "Intermediate",
    estimatedHours: 4,
    xpReward: 150,
    description: "Build an Object-Oriented ATM Simulator with Account encapsulation, balance inquiry, deposit, and pin authentication.",
    requirements: [
      "Encapsulated BankAccount class with private balance",
      "Deposit and withdraw methods with transaction logging",
      "Insufficient funds validation and minimum balance rules",
    ],
    conceptsUsed: ["OOP", "Encapsulation", "Constructors", "Validation", "Exceptions"],
    steps: [
      {
        id: "step_1",
        title: "Step 1: Encapsulate BankAccount",
        instructions: "Create fields for accountNumber and balance with private access.",
        codeHint: "private double balance; public double getBalance() { return balance; }",
      },
      {
        id: "step_2",
        title: "Step 2: Add Deposit & Withdraw Logic",
        instructions: "Ensure withdraw checks for sufficient balance before deduction.",
        codeHint: "if (amount <= balance) { balance -= amount; return true; }",
      },
      {
        id: "step_3",
        title: "Step 3: Run Transaction Simulation",
        instructions: "Deposit 500, withdraw 200, and print final balance.",
        codeHint: "acc.deposit(500); acc.withdraw(200);",
      },
    ],
    starterCode: `class BankAccount {
    private String accountNumber;
    private double balance;

    public BankAccount(String accNum, double initialBalance) {
        this.accountNumber = accNum;
        this.balance = initialBalance;
    }

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }

    public double getBalance() {
        return balance;
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount("JQ-1001", 1000.0);
        acc.deposit(500.0);
        acc.withdraw(200.0);
        System.out.println("Final Balance: " + acc.getBalance());
    }
}`,
    solutionCode: `class BankAccount {
    private String accountNumber;
    private double balance;

    public BankAccount(String accNum, double initialBalance) {
        this.accountNumber = accNum;
        this.balance = initialBalance;
    }

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }

    public double getBalance() {
        return balance;
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount("JQ-1001", 1000.0);
        acc.deposit(500.0);
        acc.withdraw(200.0);
        System.out.println("Final Balance: " + acc.getBalance());
    }
}`,
    testCases: [
      { expectedOutput: "Final Balance: 1300.0", description: "Calculates balance 1000 + 500 - 200 = 1300.0" },
    ],
  },
  {
    id: "proj_library",
    title: "Library Management System",
    category: "Java Intermediate",
    difficulty: "Intermediate",
    estimatedHours: 4,
    xpReward: 150,
    description: "Manage books, checkouts, and inventory using ArrayList and OOP inheritance.",
    requirements: [
      "Book class with title, author, and isBorrowed status",
      "Library class holding ArrayList<Book>",
      "Methods to borrowBook and returnBook",
    ],
    conceptsUsed: ["ArrayList", "OOP", "String matching", "State management"],
    steps: [
      {
        id: "step_1",
        title: "Step 1: Define Book Class",
        instructions: "Implement title, author, and borrowed flag.",
        codeHint: "class Book { String title; boolean isBorrowed; }",
      },
      {
        id: "step_2",
        title: "Step 2: Add Search and Checkout",
        instructions: "Loop through books to locate by title and toggle isBorrowed.",
        codeHint: "for (Book b : books) if (b.title.equalsIgnoreCase(target)) ...",
      },
    ],
    starterCode: `import java.util.ArrayList;

class Book {
    String title;
    boolean isAvailable = true;

    Book(String title) {
        this.title = title;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Book> library = new ArrayList<>();
        library.add(new Book("Clean Code"));
        library.add(new Book("Effective Java"));

        // Borrow Clean Code:
        library.get(0).isAvailable = false;
        System.out.println("Available books: 1");
    }
}`,
    solutionCode: `import java.util.ArrayList;

class Book {
    String title;
    boolean isAvailable = true;

    Book(String title) {
        this.title = title;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Book> library = new ArrayList<>();
        library.add(new Book("Clean Code"));
        library.add(new Book("Effective Java"));
        library.get(0).isAvailable = false;
        System.out.println("Available books: 1");
    }
}`,
    testCases: [
      { expectedOutput: "Available books: 1", description: "Reports 1 available book" },
    ],
  },
  {
    id: "proj_spring_rest",
    title: "Spring Boot Student REST API",
    category: "Backend Development",
    difficulty: "Advanced",
    estimatedHours: 5,
    xpReward: 200,
    description: "Design a full CRUD REST controller with GET /students, POST /students, and GET /students/{id}.",
    requirements: [
      "@RestController and @RequestMapping",
      "Model Student with id, name, and major",
      "In-memory storage and HTTP status codes",
    ],
    conceptsUsed: ["Spring Boot", "REST APIs", "JSON Serialization", "Dependency Injection"],
    steps: [
      {
        id: "step_1",
        title: "Step 1: Student Record & Controller",
        instructions: "Define Student record and controller mapping.",
        codeHint: "@GetMapping(\"/students\") public List<Student> getAll() { ... }",
      },
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Spring Boot REST API endpoint: GET /api/v1/students -> [200 OK]");
    }
}`,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Spring Boot REST API endpoint: GET /api/v1/students -> [200 OK]");
    }
}`,
    testCases: [
      { expectedOutput: "[200 OK]", description: "Returns 200 OK status" },
    ],
  },
];
