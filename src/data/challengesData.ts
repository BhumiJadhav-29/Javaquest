import { CodingChallenge } from "../types";

export const CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: "ch_even_odd",
    title: "Check Even or Odd (Daily Challenge)",
    difficulty: "Easy",
    category: "Math & Logic",
    xpReward: 50,
    problemStatement: "Write a Java program that determines whether a given integer is 'Even' or 'Odd'. Use the modulo operator (%) to check if the remainder when divided by 2 is 0.",
    inputExample: "int num = 4;",
    outputExample: "Even",
    starterCode: `public class Main {
    public static void main(String[] args) {
        int num = 4;
        
        // Write your condition here:
        if (num % 2 == 0) {
            System.out.println("Even");
        } else {
            System.out.println("Odd");
        }
    }
}`,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        int num = 4;
        if (num % 2 == 0) {
            System.out.println("Even");
        } else {
            System.out.println("Odd");
        }
    }
}`,
    hint: "Use `num % 2 == 0`. If the remainder when divided by 2 is zero, print 'Even'. Otherwise print 'Odd'.",
    explanation: "Any integer divisible by 2 with no remainder is even by definition.",
    testCases: [
      { input: "4", expectedOutput: "Even", description: "Evaluates 4 as Even" },
    ],
  },
  {
    id: "ch_hello_world",
    title: "Hello JavaQuest!",
    difficulty: "Easy",
    category: "Basics",
    xpReward: 30,
    problemStatement: "Print the exact greeting 'Hello JavaQuest!' to standard output using System.out.println.",
    inputExample: "None",
    outputExample: "Hello JavaQuest!",
    starterCode: `public class Main {
    public static void main(String[] args) {
        // Print "Hello JavaQuest!" below:
        
    }
}`,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello JavaQuest!");
    }
}`,
    hint: "Use `System.out.println(\"Hello JavaQuest!\");`.",
    explanation: "System.out.println prints the given argument followed by a newline.",
    testCases: [
      { expectedOutput: "Hello JavaQuest!", description: "Prints exact greeting" },
    ],
  },
  {
    id: "ch_sum_two",
    title: "Sum of Two Numbers",
    difficulty: "Easy",
    category: "Arithmetic",
    xpReward: 30,
    problemStatement: "Given two integers a = 15 and b = 27, calculate their sum and print 'Sum: 42'.",
    inputExample: "a = 15, b = 27",
    outputExample: "Sum: 42",
    starterCode: `public class Main {
    public static void main(String[] args) {
        int a = 15;
        int b = 27;
        
        // Calculate and print:
        int sum = a + b;
        System.out.println("Sum: " + sum);
    }
}`,
    hint: "Use the `+` operator between numbers to compute addition.",
    explanation: "Integer addition combines the values directly.",
    testCases: [
      { expectedOutput: "Sum: 42", description: "15 + 27 = 42" },
    ],
  },
  {
    id: "ch_max_three",
    title: "Maximum of Three Numbers",
    difficulty: "Easy",
    category: "Conditions",
    xpReward: 30,
    problemStatement: "Given three integers x = 45, y = 82, z = 19, find and print the largest number.",
    inputExample: "x = 45, y = 82, z = 19",
    outputExample: "Max: 82",
    starterCode: `public class Main {
    public static void main(String[] args) {
        int x = 45, y = 82, z = 19;
        
        int max = x;
        if (y > max) max = y;
        if (z > max) max = z;
        
        System.out.println("Max: " + max);
    }
}`,
    hint: "Initialize max with x, then update it if y or z is greater.",
    explanation: "Comparing each candidate sequentially against the current maximum works in O(1) time.",
    testCases: [
      { expectedOutput: "Max: 82", description: "Correctly identifies 82 as maximum" },
    ],
  },
  {
    id: "ch_celsius_fahrenheit",
    title: "Celsius to Fahrenheit Converter",
    difficulty: "Easy",
    category: "Math",
    xpReward: 30,
    problemStatement: "Convert temperature from Celsius (25°C) to Fahrenheit using the formula: F = (C * 9/5) + 32. Print 'Fahrenheit: 77.0'.",
    outputExample: "Fahrenheit: 77.0",
    starterCode: `public class Main {
    public static void main(String[] args) {
        double celsius = 25.0;
        double fahrenheit = (celsius * 9.0 / 5.0) + 32.0;
        System.out.println("Fahrenheit: " + fahrenheit);
    }
}`,
    hint: "Be sure to use 9.0 / 5.0 so decimal division is performed.",
    explanation: "Standard temperature conversion formula in floating-point arithmetic.",
    testCases: [
      { expectedOutput: "Fahrenheit: 77.0", description: "Converts 25C to 77.0F" },
    ],
  },
  {
    id: "ch_fizzbuzz",
    title: "Classic FizzBuzz (1 to 15)",
    difficulty: "Easy",
    category: "Control Flow",
    xpReward: 35,
    problemStatement: "Loop from 1 to 15. For multiples of 3, print 'Fizz'. For multiples of 5, print 'Buzz'. For multiples of both 3 and 5, print 'FizzBuzz'. Otherwise print the number.",
    outputExample: "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz",
    starterCode: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 15; i++) {
            if (i % 15 == 0) {
                System.out.print("FizzBuzz ");
            } else if (i % 3 == 0) {
                System.out.print("Fizz ");
            } else if (i % 5 == 0) {
                System.out.print("Buzz ");
            } else {
                System.out.print(i + " ");
            }
        }
    }
}`,
    hint: "Always check `i % 15 == 0` first before checking 3 or 5 individually!",
    explanation: "Check the most specific condition (divisible by both 3 and 5) first.",
    testCases: [
      { expectedOutput: "FizzBuzz", description: "Contains FizzBuzz at 15" },
    ],
  },
  {
    id: "ch_factorial",
    title: "Factorial of a Number",
    difficulty: "Medium",
    category: "Math & Loops",
    xpReward: 35,
    problemStatement: "Calculate 5! (5 factorial: 5 * 4 * 3 * 2 * 1) and print 'Factorial: 120'.",
    outputExample: "Factorial: 120",
    starterCode: `public class Main {
    public static void main(String[] args) {
        int n = 5;
        long fact = 1;
        for (int i = 1; i <= n; i++) {
            fact *= i;
        }
        System.out.println("Factorial: " + fact);
    }
}`,
    hint: "Accumulate multiplication starting from fact = 1 up to n.",
    explanation: "Factorial multiplies all positive integers up to n.",
    testCases: [
      { expectedOutput: "Factorial: 120", description: "5! equals 120" },
    ],
  },
  {
    id: "ch_reverse_string",
    title: "Reverse a String",
    difficulty: "Easy",
    category: "Strings",
    xpReward: 30,
    problemStatement: "Reverse the string 'JavaQuest' and print the resulting reversed text 'tseuQavaJ'.",
    outputExample: "Reversed: tseuQavaJ",
    starterCode: `public class Main {
    public static void main(String[] args) {
        String str = "JavaQuest";
        String reversed = "";
        for (int i = str.length() - 1; i >= 0; i--) {
            reversed += str.charAt(i);
        }
        System.out.println("Reversed: " + reversed);
    }
}`,
    hint: "Loop backwards from `str.length() - 1` down to 0, appending `charAt(i)`.",
    explanation: "Traversing in reverse order constructs the inverted string.",
    testCases: [
      { expectedOutput: "Reversed: tseuQavaJ", description: "Reverses JavaQuest" },
    ],
  },
  {
    id: "ch_check_palindrome",
    title: "Palindrome Checker",
    difficulty: "Easy",
    category: "Strings",
    xpReward: 30,
    problemStatement: "Determine if the word 'racecar' reads the same forwards and backwards. Print 'racecar is a palindrome'.",
    outputExample: "racecar is a palindrome",
    starterCode: `public class Main {
    public static void main(String[] args) {
        String word = "racecar";
        boolean isPalindrome = true;
        int left = 0, right = word.length() - 1;
        
        while (left < right) {
            if (word.charAt(left) != word.charAt(right)) {
                isPalindrome = false;
                break;
            }
            left++;
            right--;
        }
        
        if (isPalindrome) {
            System.out.println(word + " is a palindrome");
        }
    }
}`,
    hint: "Use two pointers: one at the start, one at the end, comparing characters while moving inward.",
    explanation: "A two-pointer approach checks symmetry in O(n) time.",
    testCases: [
      { expectedOutput: "racecar is a palindrome", description: "Detects palindrome" },
    ],
  },
  {
    id: "ch_fibonacci",
    title: "Fibonacci Sequence (First 7 terms)",
    difficulty: "Medium",
    category: "Algorithms",
    xpReward: 40,
    problemStatement: "Print the first 7 numbers of the Fibonacci sequence (starting 0, 1, 1, 2, 3, 5, 8).",
    outputExample: "0 1 1 2 3 5 8",
    starterCode: `public class Main {
    public static void main(String[] args) {
        int n = 7;
        int a = 0, b = 1;
        for (int i = 0; i < n; i++) {
            System.out.print(a + " ");
            int next = a + b;
            a = b;
            b = next;
        }
    }
}`,
    hint: "Next term is always the sum of previous two terms: `next = a + b`.",
    explanation: "Each step slides variables a and b forward.",
    testCases: [
      { expectedOutput: "0 1 1 2 3 5 8", description: "7 terms generated" },
    ],
  },
  {
    id: "ch_array_sum_avg",
    title: "Array Sum & Average",
    difficulty: "Easy",
    category: "Arrays",
    xpReward: 30,
    problemStatement: "Given an array of integers { 10, 20, 30, 40 }, calculate the sum and average. Print 'Sum: 100, Avg: 25.0'.",
    outputExample: "Sum: 100, Avg: 25.0",
    starterCode: `public class Main {
    public static void main(String[] args) {
        int[] numbers = { 10, 20, 30, 40 };
        int sum = 0;
        for (int n : numbers) {
            sum += n;
        }
        double avg = (double) sum / numbers.length;
        System.out.println("Sum: " + sum + ", Avg: " + avg);
    }
}`,
    hint: "Sum all numbers with a for-each loop, then divide by `numbers.length`.",
    explanation: "Cast sum to double to prevent integer truncation when calculating average.",
    testCases: [
      { expectedOutput: "Sum: 100, Avg: 25.0", description: "Correct sum and avg" },
    ],
  },
  {
    id: "ch_prime_checker",
    title: "Prime Number Checker",
    difficulty: "Medium",
    category: "Math & Algorithms",
    xpReward: 40,
    problemStatement: "Determine if the number 29 is prime. Print '29 is prime'.",
    outputExample: "29 is prime",
    starterCode: `public class Main {
    public static void main(String[] args) {
        int n = 29;
        boolean isPrime = true;
        if (n <= 1) isPrime = false;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            System.out.println(n + " is prime");
        }
    }
}`,
    hint: "A number is prime if it is greater than 1 and has no divisors other than 1 and itself.",
    explanation: "Checking divisors up to sqrt(n) optimizes the search to O(sqrt(n)).",
    testCases: [
      { expectedOutput: "29 is prime", description: "Identifies 29 as prime" },
    ],
  },
  {
    id: "ch_count_vowels",
    title: "Count Vowels in a String",
    difficulty: "Easy",
    category: "Strings",
    xpReward: 30,
    problemStatement: "Count how many vowels (a, e, i, o, u) exist in 'Duolingo style programming'. Print 'Vowels: 9'.",
    outputExample: "Vowels: 9",
    starterCode: `public class Main {
    public static void main(String[] args) {
        String text = "Duolingo style programming".toLowerCase();
        int vowels = 0;
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
                vowels++;
            }
        }
        System.out.println("Vowels: " + vowels);
    }
}`,
    hint: "Convert the string to lowercase first, then inspect each character.",
    explanation: "Comparing characters against 'a', 'e', 'i', 'o', 'u' counts the vowels.",
    testCases: [
      { expectedOutput: "Vowels: 9", description: "Counts 9 vowels" },
    ],
  },
  {
    id: "ch_min_array",
    title: "Find Minimum in Array",
    difficulty: "Easy",
    category: "Arrays",
    xpReward: 30,
    problemStatement: "Find the smallest number in { 64, 25, 12, 22, 11 } and print 'Min: 11'.",
    outputExample: "Min: 11",
    starterCode: `public class Main {
    public static void main(String[] args) {
        int[] arr = { 64, 25, 12, 22, 11 };
        int min = arr[0];
        for (int num : arr) {
            if (num < min) min = num;
        }
        System.out.println("Min: " + min);
    }
}`,
    hint: "Initialize min with `arr[0]` and update whenever `num < min`.",
    explanation: "Linear scan through elements tracks the smallest seen so far.",
    testCases: [
      { expectedOutput: "Min: 11", description: "Finds 11 as min" },
    ],
  },
  {
    id: "ch_swap_numbers",
    title: "Swap Two Numbers without Temp Variable",
    difficulty: "Medium",
    category: "Logic & Math",
    xpReward: 35,
    problemStatement: "Given a = 10 and b = 20, swap their values without creating any third temporary variable. Print 'a: 20, b: 10'.",
    outputExample: "a: 20, b: 10",
    starterCode: `public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;
        
        // Swap without temp:
        a = a + b; // 30
        b = a - b; // 10
        a = a - b; // 20
        
        System.out.println("a: " + a + ", b: " + b);
    }
}`,
    hint: "Use arithmetic: `a = a + b`, then `b = a - b`, then `a = a - b`.",
    explanation: "Arithmetic sum and differences allow in-place value swapping.",
    testCases: [
      { expectedOutput: "a: 20, b: 10", description: "Values swapped successfully" },
    ],
  },
  {
    id: "ch_leap_year",
    title: "Leap Year Checker",
    difficulty: "Easy",
    category: "Conditions",
    xpReward: 30,
    problemStatement: "Check if the year 2024 is a leap year (divisible by 4, except if divisible by 100 unless also divisible by 400). Print '2024 is a leap year'.",
    outputExample: "2024 is a leap year",
    starterCode: `public class Main {
    public static void main(String[] args) {
        int year = 2024;
        boolean isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
        if (isLeap) {
            System.out.println(year + " is a leap year");
        }
    }
}`,
    hint: "Formula: `(year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)`.",
    explanation: "Standard Gregorian calendar leap year rule.",
    testCases: [
      { expectedOutput: "2024 is a leap year", description: "Validates 2024" },
    ],
  },
  {
    id: "ch_second_largest",
    title: "Second Largest Element in Array",
    difficulty: "Medium",
    category: "Arrays & Algorithms",
    xpReward: 45,
    problemStatement: "Find the second largest unique value in { 12, 35, 1, 10, 34, 1 } and print 'Second Largest: 34'.",
    outputExample: "Second Largest: 34",
    starterCode: `public class Main {
    public static void main(String[] args) {
        int[] arr = { 12, 35, 1, 10, 34, 1 };
        int first = Integer.MIN_VALUE;
        int second = Integer.MIN_VALUE;
        
        for (int n : arr) {
            if (n > first) {
                second = first;
                first = n;
            } else if (n > second && n != first) {
                second = n;
            }
        }
        System.out.println("Second Largest: " + second);
    }
}`,
    hint: "Maintain both first and second largest variables in a single pass.",
    explanation: "One-pass O(n) solution without sorting.",
    testCases: [
      { expectedOutput: "Second Largest: 34", description: "Identifies 34" },
    ],
  },
  {
    id: "ch_grade_calculator",
    title: "Student Grade Calculator",
    difficulty: "Easy",
    category: "Methods & Logic",
    xpReward: 30,
    problemStatement: "Given a student score of 88, write a method to print 'Grade: B' (>=90: A, >=80: B, >=70: C, >=60: D, else F).",
    outputExample: "Grade: B",
    starterCode: `public class Main {
    public static void main(String[] args) {
        int score = 88;
        char grade;
        if (score >= 90) grade = 'A';
        else if (score >= 80) grade = 'B';
        else if (score >= 70) grade = 'C';
        else if (score >= 60) grade = 'D';
        else grade = 'F';
        
        System.out.println("Grade: " + grade);
    }
}`,
    hint: "Use sequential `if - else if` statements.",
    explanation: "Standard grading ladder assigns categorical grade.",
    testCases: [
      { expectedOutput: "Grade: B", description: "Score 88 gives Grade B" },
    ],
  },
  {
    id: "ch_atm_simulation",
    title: "Simple ATM Withdrawal Validation",
    difficulty: "Medium",
    category: "OOP & Validation",
    xpReward: 40,
    problemStatement: "Given balance = 500.0 and withdrawal = 150.0 with a 2.50 fee, verify sufficient funds and print 'Withdrawal successful. Remaining balance: 347.5'.",
    outputExample: "Withdrawal successful. Remaining balance: 347.5",
    starterCode: `public class Main {
    public static void main(String[] args) {
        double balance = 500.0;
        double withdraw = 150.0;
        double fee = 2.50;
        double totalDeduction = withdraw + fee;
        
        if (balance >= totalDeduction) {
            balance -= totalDeduction;
            System.out.println("Withdrawal successful. Remaining balance: " + balance);
        } else {
            System.out.println("Insufficient funds.");
        }
    }
}`,
    hint: "Check `balance >= (withdraw + fee)` before deducting.",
    explanation: "Financial business logic requires atomic validation before mutation.",
    testCases: [
      { expectedOutput: "Withdrawal successful. Remaining balance: 347.5", description: "Processes withdrawal" },
    ],
  },
  {
    id: "ch_anagram_check",
    title: "Check if Two Words are Anagrams",
    difficulty: "Medium",
    category: "Strings & Sorting",
    xpReward: 40,
    problemStatement: "Determine if 'silent' and 'listen' contain the exact same characters. Print 'silent and listen are anagrams'.",
    outputExample: "silent and listen are anagrams",
    starterCode: `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        String s1 = "silent";
        String s2 = "listen";
        
        char[] c1 = s1.toCharArray();
        char[] c2 = s2.toCharArray();
        Arrays.sort(c1);
        Arrays.sort(c2);
        
        if (Arrays.equals(c1, c2)) {
            System.out.println(s1 + " and " + s2 + " are anagrams");
        }
    }
}`,
    hint: "Convert both strings to character arrays, sort them with Arrays.sort(), and compare with Arrays.equals().",
    explanation: "Two words are anagrams if their sorted character arrays are identical.",
    testCases: [
      { expectedOutput: "silent and listen are anagrams", description: "Detects anagrams" },
    ],
  },
];
