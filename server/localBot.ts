/**
 * Quizy Local Intelligent Rule & Prompt Engine
 * Ultra-fast (<5ms), zero-latency, local responses based on pattern matching,
 * contextual analysis, curriculum knowledge, and rules.
 */

interface ChatContext {
  userId?: number;
  currentQuizTitle?: string;
  userScore?: number;
  weakAreas?: string[];
}

interface RuleResponse {
  keywords: string[];
  patterns?: RegExp[];
  priority?: number;
  handler: (query: string, context?: ChatContext) => string;
}

const KNOWLEDGE_RULES: RuleResponse[] = [
  // -------------------------------------------------------------
  // GREETINGS & INTRODUCTIONS
  // -------------------------------------------------------------
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'who are you', 'what can you do', 'help me'],
    patterns: [/^(hi|hello|hey|yo|greetings|hola)\b/i, /who (are you|created you)/i, /what can you (do|help)/i],
    priority: 10,
    handler: (_, ctx) => {
      let msg = `👋 **Hello! I am Quizy Assistant**, your local AI study coach and platform guide.\n\n` +
        `Here is what you can ask me:\n` +
        `• 📚 **Quiz Guidance**: How exams, timers, and scoring work.\n` +
        `• 🛡️ **Anti-Cheat Rules**: How tab-switch and blur detection protect exam integrity.\n` +
        `• 📈 **ML Score Prediction**: How our Linear Regression model forecasts your results.\n` +
        `• 💻 **Curriculum Explanations**: Ask me about Python, Machine Learning, SQL, Web Dev, or Data Structures!\n` +
        `• 🎯 **Practice Questions**: Ask *"Give me a practice problem on Python"* to test your skills.`;

      if (ctx?.weakAreas && ctx.weakAreas.length > 0) {
        msg += `\n\n💡 *Tip for you: Your current focus area is **${ctx.weakAreas.join(', ')}**. Feel free to ask me to explain any related concepts!*`;
      }
      return msg;
    },
  },

  // -------------------------------------------------------------
  // QUIZY PLATFORM & QUIZ TAKING
  // -------------------------------------------------------------
  {
    keywords: ['take quiz', 'start quiz', 'how to quiz', 'how to take', 'attend quiz', 'exam'],
    patterns: [/how (do i|to) (take|start|attend|begin) (a )?quiz/i, /where (are|is) (the )?quizzes/i],
    priority: 9,
    handler: () =>
      `📝 **How to Take a Quiz on Quizy:**\n\n` +
      `1. Open the **User Dashboard** and switch to the **Available Quizzes** tab in the sidebar.\n` +
      `2. Filter quizzes by subject (e.g. *Python, Machine Learning, Web Dev, Databases*).\n` +
      `3. Click **Start Quiz** on your chosen topic.\n` +
      `4. Read each question carefully and select an option. You can navigate between questions using the numbers palette.\n` +
      `5. Once completed, click **Finish & Submit** to view your instant grade breakdown and answer explanations!`,
  },
  {
    keywords: ['anti cheat', 'anticheat', 'tab switch', 'violation', 'cheat', 'blur', 'switch tab'],
    patterns: [/anti[- ]?cheat/i, /tab switch/i, /violation/i, /blur/i, /cheating/i],
    priority: 9,
    handler: () =>
      `🛡️ **Quizy Anti-Cheat System:**\n\n` +
      `• **Tab Visibility Tracking**: Switching browser tabs or minimizing the browser fires a \`visibilitychange\` event and logs a violation.\n` +
      `• **Window Blur Detection**: Clicking outside the test window or opening another application triggers an instant alert modal.\n` +
      `• **Attempt Record**: All recorded violation counts are saved directly to your submission transcript and visible on the admin audit logs.\n\n` +
      `*Tip: Keep your exam window fullscreen and focused until you hit submit!*`,
  },
  {
    keywords: ['linear regression', 'prediction', 'ml score', 'forecast', 'predicted score', 'ml insights'],
    patterns: [/linear regression/i, /how (is|does) (the )?score predicted/i, /ml forecast/i, /machine learning insight/i],
    priority: 9,
    handler: () =>
      `📈 **How ML Score Prediction Works in Quizy:**\n\n` +
      `• **Algorithm**: Ordinary Least Squares (OLS) Linear Regression ($y = mx + c$).\n` +
      `• **Input Vector**: Chronological percentage scores from your past quiz attempts.\n` +
      `• **Calculation**: We compute slope ($m$) and intercept ($c$) over attempt indices ($x$) to calculate the projected score ($y$) for attempt $x+1$.\n` +
      `• **Thresholds**:\n` +
      `  - **≥ 80%**: Excellent readiness; high likelihood of acing upcoming tests.\n` +
      `  - **50% - 79%**: Steady progression with room for targeted revision.\n` +
      `  - **< 50%**: At-Risk indicator; system generates recommended topics to practice.`,
  },
  {
    keywords: ['streak', 'daily streak', 'flame', 'streak count'],
    patterns: [/streak/i, /daily streak/i],
    priority: 8,
    handler: () =>
      `🔥 **Daily Streaks in Quizy:**\n\n` +
      `• Complete at least one quiz each day to keep your streak counter active.\n` +
      `• Active streaks unlock bonus points on the global leaderboard and improve retention according to spaced repetition research.\n` +
      `• Check your current streak on the top-right pill of the student banner!`,
  },
  {
    keywords: ['pdf', 'report', 'transcript', 'download report', 'export'],
    patterns: [/download (pdf|report|transcript)/i, /generate report/i, /export/i],
    priority: 8,
    handler: () =>
      `📄 **Downloading Student Reports:**\n\n` +
      `• **For Students**: Click **Download PDF Report** at the bottom of the left sidebar to generate and print your performance transcript with accuracy metrics and exam logs.\n` +
      `• **For Admins**: Go to **User Details**, select any student, and click **Generate Report** to export their full academic scorecard.`,
  },
  {
    keywords: ['admin', 'manage questions', 'add question', 'create quiz', 'ollama', 'ai generator'],
    patterns: [/admin panel/i, /how to (add|create) (a )?question/i, /ai question generator/i],
    priority: 8,
    handler: () =>
      `⚙️ **Admin Panel Capabilities:**\n\n` +
      `• **Overview KPIs**: Real-time stats on registered users, active students, total tests, and attempts.\n` +
      `• **Manage Questions**: Add custom multiple-choice questions with answer keys and explanations.\n` +
      `• **AI Question Generator**: Generate fresh curriculum questions automatically by topic, count, and difficulty.\n` +
      `• **User Predictions**: View cohort-wide linear regression projections and identify students needing guidance.\n` +
      `• **Audit Results**: Inspect question-by-question choices and anti-cheat violation counts for any exam.`,
  },

  // -------------------------------------------------------------
  // SUBJECT KNOWLEDGE: PYTHON
  // -------------------------------------------------------------
  {
    keywords: ['python', 'list vs tuple', 'decorator', 'gil', 'lambda', 'generator', 'list comprehension'],
    patterns: [/python/i, /list (vs|and) tuple/i, /decorator/i, /global interpreter lock/i, /generator/i],
    priority: 7,
    handler: query => {
      const q = query.toLowerCase();
      if (q.includes('list') && q.includes('tuple')) {
        return (
          `🐍 **Lists vs Tuples in Python:**\n\n` +
          `• **Lists (\`[ ]\`)**: Mutable (can add, remove, or modify items in place), slower, larger memory footprint.\n` +
          `• **Tuples (\`( )\`)**: Immutable (cannot change once created), faster iteration, hashable (can be dictionary keys).\n\n` +
          `\`\`\`python\n` +
          `my_list = [1, 2, 3]   # Mutable: my_list.append(4)\n` +
          `my_tuple = (1, 2, 3)  # Immutable: fixed values\n` +
          `\`\`\``
        );
      }
      if (q.includes('decorator')) {
        return (
          `🐍 **Python Decorators:**\n\n` +
          `A decorator is a function that takes another function as an argument, adds functionality, and returns the modified function without changing the original source code.\n\n` +
          `\`\`\`python\n` +
          `def my_logger(func):\n` +
          `    def wrapper(*args, **kwargs):\n` +
          `        print(f"Running {func.__name__}")\n` +
          `        return func(*args, **kwargs)\n` +
          `    return wrapper\n\n` +
          `@my_logger\n` +
          `def greet():\n` +
          `    print("Hello, Quizy!")\n` +
          `\`\`\``
        );
      }
      if (q.includes('gil')) {
        return (
          `🐍 **Python GIL (Global Interpreter Lock):**\n\n` +
          `• The GIL is a mutex that prevents multiple native threads from executing Python bytecodes simultaneously in CPython.\n` +
          `• **Why it exists**: Simplifies memory management (reference counting is thread-safe without fine-grained locks).\n` +
          `• **Workaround**: Use the \`multiprocessing\` module for CPU-bound tasks or asynchronous I/O (\`asyncio\`) for network-bound tasks.`
        );
      }
      return (
        `🐍 **Python Core Summary:**\n\n` +
        `Python is a dynamically typed, high-level interpreted language known for clean syntax.\n` +
        `Key exam topics:\n` +
        `• **Data Structures**: Lists, Dictionaries (hash maps, $O(1)$ lookup), Sets, Tuples.\n` +
        `• **Comprehensions**: \`[x**2 for x in range(10) if x % 2 == 0]\`\n` +
        `• **Memory**: Garbage collection with reference counting and cyclical detector.\n` +
        `• **OOP**: Classes, multiple inheritance (MRO - Method Resolution Order), dunder methods (\`__init__\`, \`__repr__\`).`
      );
    },
  },

  // -------------------------------------------------------------
  // SUBJECT KNOWLEDGE: MACHINE LEARNING & AI
  // -------------------------------------------------------------
  {
    keywords: ['machine learning', 'supervised', 'unsupervised', 'overfitting', 'cross validation', 'gradient descent', 'confusion matrix', 'precision', 'recall'],
    patterns: [/machine learning/i, /supervised (vs|or) unsupervised/i, /overfitting/i, /gradient descent/i, /precision (vs|and) recall/i],
    priority: 7,
    handler: query => {
      const q = query.toLowerCase();
      if (q.includes('overfit') || q.includes('underfit')) {
        return (
          `🤖 **Overfitting vs Underfitting in ML:**\n\n` +
          `• **Overfitting**: Model memorizes training noise and fails to generalize to unseen test data (High Variance, Low Bias).\n` +
          `  - *Remedies*: Regularization (L1/L2), Dropout, pruning decision trees, increasing training data, Cross-Validation.\n` +
          `• **Underfitting**: Model is too simple to capture underlying patterns (High Bias, Low Variance).\n` +
          `  - *Remedies*: Increase model complexity, feature engineering, reduce regularization.`
        );
      }
      if (q.includes('precision') || q.includes('recall') || q.includes('confusion')) {
        return (
          `📊 **Precision vs Recall & Confusion Matrix:**\n\n` +
          `• **Precision**: $\\frac{TP}{TP + FP}$ — Out of all predicted positives, how many were actually positive? (Crucial for spam detection).\n` +
          `• **Recall (Sensitivity)**: $\\frac{TP}{TP + FN}$ — Out of all actual positives, how many did we correctly identify? (Crucial for medical diagnosis).\n` +
          `• **F1-Score**: Harmonic mean of Precision and Recall: $2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}$.`
        );
      }
      if (q.includes('supervised')) {
        return (
          `🤖 **Supervised vs Unsupervised Learning:**\n\n` +
          `• **Supervised Learning**: Model trains on labeled datasets $(X, y)$. Tasks include *Classification* (discrete outputs like Cat vs Dog) and *Regression* (continuous numbers like House Prices).\n` +
          `• **Unsupervised Learning**: Model finds hidden patterns in unlabeled data $X$. Tasks include *Clustering* (K-Means, DBSCAN) and *Dimensionality Reduction* (PCA, t-SNE).`
        );
      }
      return (
        `🤖 **Machine Learning Quick Reference:**\n\n` +
        `• **Supervised**: Linear/Logistic Regression, Random Forests, SVMs, Neural Networks.\n` +
        `• **Unsupervised**: K-Means, Hierarchical Clustering, PCA.\n` +
        `• **Optimization**: Gradient Descent (updates weights: $\\theta = \\theta - \\alpha \\nabla J(\\theta)$).\n` +
        `• **Evaluation**: MSE/RMSE for regression, ROC-AUC and Confusion Matrix for classification.`
      );
    },
  },

  // -------------------------------------------------------------
  // SUBJECT KNOWLEDGE: DATABASES & SQL
  // -------------------------------------------------------------
  {
    keywords: ['sql', 'database', 'acid', 'normalization', 'join', 'primary key', 'foreign key', 'index'],
    patterns: [/sql/i, /database/i, /acid/i, /normalization/i, /join/i, /primary key/i],
    priority: 7,
    handler: query => {
      const q = query.toLowerCase();
      if (q.includes('acid')) {
        return (
          `🗄️ **ACID Properties in Relational Databases:**\n\n` +
          `• **A - Atomicity**: Transactions execute as all-or-nothing (if one step fails, everything rolls back).\n` +
          `• **C - Consistency**: Database transitions strictly from one valid state to another, respecting all constraints.\n` +
          `• **I - Isolation**: Concurrent transactions execute independently without interfering with each other.\n` +
          `• **D - Durability**: Once a transaction is committed, changes survive system crashes and power failures.`
        );
      }
      if (q.includes('join')) {
        return (
          `🗄️ **SQL JOIN Types:**\n\n` +
          `• **INNER JOIN**: Returns records that have matching values in both tables.\n` +
          `• **LEFT JOIN**: Returns all records from the left table and matched records from the right table (NULL if no match).\n` +
          `• **RIGHT JOIN**: Returns all records from the right table and matched records from the left table.\n` +
          `• **FULL OUTER JOIN**: Returns all records when there is a match in either left or right table.`
        );
      }
      return (
        `🗄️ **SQL & Database Essentials:**\n\n` +
        `• **Normalization**: 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies).\n` +
        `• **Keys**: Primary Key (unique, not null) vs Foreign Key (references PK in another table for referential integrity).\n` +
        `• **Indexing**: B-Tree indexes speed up \`SELECT\` queries from $O(N)$ full table scan to $O(\\log N)$, with a slight overhead on \`INSERT\`/\`UPDATE\`.`
      );
    },
  },

  // -------------------------------------------------------------
  // SUBJECT KNOWLEDGE: WEB DEVELOPMENT & REACT
  // -------------------------------------------------------------
  {
    keywords: ['react', 'hook', 'useState', 'useEffect', 'props', 'dom', 'rest api', 'http', 'jwt'],
    patterns: [/react/i, /hooks?/i, /dom/i, /rest api/i, /http status/i],
    priority: 7,
    handler: query => {
      const q = query.toLowerCase();
      if (q.includes('hook') || q.includes('useeffect') || q.includes('usestate')) {
        return (
          `⚛️ **React Hooks Primer:**\n\n` +
          `• **useState**: Declares reactive state variable in functional components.\n` +
          `• **useEffect**: Handles side-effects (API fetching, subscriptions, DOM manipulation). Dependency array controls execution.\n` +
          `• **useMemo / useCallback**: Memoizes computed values and function references to prevent unnecessary child re-renders.\n` +
          `• **Rule of Hooks**: Only call hooks at top level; never inside loops, conditions, or nested functions.`
        );
      }
      return (
        `🌐 **Web Development Essentials:**\n\n` +
        `• **Client-Server Architecture**: Browser sends HTTP requests (GET, POST, PUT, DELETE) to Express API endpoints.\n` +
        `• **HTTP Status Codes**: \`200 OK\`, \`201 Created\`, \`400 Bad Request\`, \`401 Unauthorized\`, \`404 Not Found\`, \`500 Internal Server Error\`.\n` +
        `• **State Management**: React Context, local state, and unidirectional data flow.`
      );
    },
  },

  // -------------------------------------------------------------
  // PRACTICE QUESTION GENERATOR
  // -------------------------------------------------------------
  {
    keywords: ['practice', 'give me a question', 'quiz me', 'practice problem', 'test my knowledge'],
    patterns: [/practice (question|problem)/i, /quiz me/i, /test (me|my knowledge)/i],
    priority: 8,
    handler: query => {
      const q = query.toLowerCase();
      if (q.includes('python')) {
        return (
          `🎯 **Practice Question: Python**\n\n` +
          `**Question:** What will be the output of the following Python snippet?\n` +
          `\`\`\`python\n` +
          `a = [1, 2, 3]\n` +
          `b = a\n` +
          `b.append(4)\n` +
          `print(len(a))\n` +
          `\`\`\`\n` +
          `• **A)** 3\n` +
          `• **B)** 4\n` +
          `• **C)** Error\n` +
          `• **D)** None\n\n` +
          `*(Reply with your choice to check!)*`
        );
      }
      if (q.includes('sql') || q.includes('database')) {
        return (
          `🎯 **Practice Question: Databases**\n\n` +
          `**Question:** Which SQL clause is used to filter records **after** an aggregate \`GROUP BY\` operation?\n\n` +
          `• **A)** \`WHERE\`\n` +
          `• **B)** \`HAVING\`\n` +
          `• **C)** \`ORDER BY\`\n` +
          `• **D)** \`LIMIT\`\n\n` +
          `*(Reply with your choice to check!)*`
        );
      }
      return (
        `🎯 **Practice Question: Machine Learning**\n\n` +
        `**Question:** Which technique is specifically designed to reduce overfitting in deep neural networks by randomly deactivating neurons during training?\n\n` +
        `• **A)** Batch Normalization\n` +
        `• **B)** Dropout\n` +
        `• **C)** Gradient Clipping\n` +
        `• **D)** Max Pooling\n\n` +
        `*(Reply with your choice to check!)*`
      );
    },
  },

  // -------------------------------------------------------------
  // PRACTICE QUESTION ANSWERS
  // -------------------------------------------------------------
  {
    keywords: ['option a', 'option b', 'option c', 'option d', 'answer is a', 'answer is b', 'answer is c', 'answer is d'],
    patterns: [/^(option )?[a-d]$/i, /^it is [a-d]$/i],
    priority: 8,
    handler: query => {
      const q = query.trim().toUpperCase();
      if (q.includes('B')) {
        return (
          `✅ **Correct! Option B is the right answer.**\n\n` +
          `• For Python: Lists are mutable references, so modifying \`b\` also modifies \`a\` (\`len(a) == 4\`).\n` +
          `• For Databases: \`HAVING\` filters aggregated groups, while \`WHERE\` filters individual rows.\n` +
          `• For ML: **Dropout** randomly disables a fraction of units during training to prevent co-adaptation.\n\n` +
          `Great job! Ask me for another practice problem anytime.`
        );
      }
      return (
        `💡 **Not quite! The correct choice is Option B.**\n\n` +
        `• Remember that in Python, assignment \`b = a\` copies the object reference, not the list contents.\n` +
        `• In SQL, \`HAVING\` is used for aggregated values (\`COUNT\`, \`AVG\`), while \`WHERE\` works on raw rows before grouping.\n\n` +
        `Keep practicing! Would you like another question?`
      );
    },
  },

  // -------------------------------------------------------------
  // STUDY TIPS & IMPROVEMENT
  // -------------------------------------------------------------
  {
    keywords: ['improve', 'study tip', 'how to score', 'better score', 'tips', 'advice', 'prepare'],
    patterns: [/how (can i|to) (improve|study|prepare|score better)/i, /study tips?/i],
    priority: 7,
    handler: (_, ctx) => {
      let advice = `🎯 **Proven Strategies to Maximize Your Quizy Score:**\n\n` +
        `1. **Active Recall**: Test yourself regularly rather than passively re-reading notes.\n` +
        `2. **Review Missed Questions**: Spend 2 minutes reviewing the explanation for every wrong answer on your post-quiz summary.\n` +
        `3. **Pacing & Timing**: In a 10-minute 10-question test, aim for under 45 seconds per question to leave 2.5 minutes for review.\n` +
        `4. **Daily Practice**: Even a 5-minute quiz every day keeps your streak alive and builds long-term retention.`;

      if (ctx?.weakAreas && ctx.weakAreas.length > 0) {
        advice += `\n\n📌 **Personalized Recommendation**: Your analytics suggest focusing on **${ctx.weakAreas.join(', ')}**. Take targeted quizzes on these topics today!`;
      }
      return advice;
    },
  },
];

/**
 * Main query processor: checks rules with score ranking and returns instantaneous,
 * high-quality markdown response.
 */
export function getLocalChatResponse(query: string, context?: ChatContext): string {
  if (!query || typeof query !== 'string') {
    return "Hello! How can I assist you with your Quizy studies today?";
  }

  const cleanQuery = query.trim().toLowerCase();

  // Find matching rules
  let bestRule: RuleResponse | null = null;
  let bestScore = 0;

  for (const rule of KNOWLEDGE_RULES) {
    let score = 0;

    // Pattern matching (high confidence)
    if (rule.patterns) {
      for (const pattern of rule.patterns) {
        if (pattern.test(cleanQuery)) {
          score += 10;
          break;
        }
      }
    }

    // Keyword matching
    for (const kw of rule.keywords) {
      if (cleanQuery.includes(kw.toLowerCase())) {
        score += 3;
      }
    }

    if (rule.priority) {
      score += rule.priority * 0.5;
    }

    if (score > bestScore) {
      bestScore = score;
      bestRule = rule;
    }
  }

  if (bestRule && bestScore >= 3) {
    return bestRule.handler(query, context);
  }

  // Smart Contextual Fallback
  let fallback = `🤖 **Quizy Assistant**: I'm here to help you excel in your exams!\n\n` +
    `You can ask me about:\n` +
    `• **Topics**: Python programming, Machine Learning, Relational Databases/SQL, and Web Development.\n` +
    `• **Platform Features**: Anti-cheat rules, ML score predictions, and taking quizzes.\n` +
    `• **Interactive Practice**: Type *"Quiz me on Python"* or *"Explain ACID properties"*.`;

  if (context?.currentQuizTitle) {
    fallback += `\n\n*Currently viewing: **${context.currentQuizTitle}**.*`;
  }

  return fallback;
}
