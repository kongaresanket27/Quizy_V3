import { GoogleGenAI } from '@google/genai';

export interface GeneratedQuestion {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'a' | 'b' | 'c' | 'd';
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation: string;
}

// Deep Curriculum Question Bank
const CURRICULUM_BANK: Record<string, GeneratedQuestion[]> = {
  Python: [
    {
      question: 'Which of the following data structures in Python is immutable?',
      option_a: 'Tuple',
      option_b: 'List',
      option_c: 'Dictionary',
      option_d: 'Set',
      correct_option: 'a',
      subject: 'Python',
      difficulty: 'Easy',
      explanation: 'Tuples are immutable sequences in Python; once created, their elements cannot be modified, added, or removed.'
    },
    {
      question: 'What is the primary purpose of the Global Interpreter Lock (GIL) in CPython?',
      option_a: 'To synchronize memory access and make reference counting thread-safe',
      option_b: 'To accelerate multithreaded CPU computation across multiple cores',
      option_c: 'To compile Python code directly into machine assembly at runtime',
      option_d: 'To encrypt bytecode files before disk caching',
      correct_option: 'a',
      subject: 'Python',
      difficulty: 'Hard',
      explanation: 'The GIL is a mutex that prevents multiple native threads from executing Python bytecodes simultaneously, ensuring CPython memory management and reference counting remain safe.'
    },
    {
      question: 'What is the time complexity of looking up a key in a standard Python dictionary in average case?',
      option_a: 'O(1)',
      option_b: 'O(log N)',
      option_c: 'O(N)',
      option_d: 'O(N log N)',
      correct_option: 'a',
      subject: 'Python',
      difficulty: 'Medium',
      explanation: 'Python dictionaries are implemented as hash tables with open addressing, providing O(1) average-case time complexity for key lookups.'
    },
    {
      question: 'What does the `yield` keyword do when used inside a Python function?',
      option_a: 'It converts the function into a generator that produces values lazily',
      option_b: 'It permanently terminates the function execution and clears local stack memory',
      option_c: 'It forces the function to run in a separate background thread',
      option_d: 'It casts all returned variables into floating-point numbers',
      correct_option: 'a',
      subject: 'Python',
      difficulty: 'Medium',
      explanation: 'The yield keyword turns a standard function into a generator iterator, suspending its state and returning values one at a time upon request.'
    },
    {
      question: 'Which built-in Python module is best suited for executing CPU-bound tasks in parallel across multiple CPU cores?',
      option_a: 'multiprocessing',
      option_b: 'threading',
      option_c: 'asyncio',
      option_d: 'socket',
      correct_option: 'a',
      subject: 'Python',
      difficulty: 'Medium',
      explanation: 'Because of the GIL, threading cannot achieve true CPU parallelism in CPython. The multiprocessing module sidesteps the GIL by spawning distinct OS processes with dedicated interpreters.'
    },
    {
      question: 'What will be the output of `[x for x in range(6) if x % 2 == 0]`?',
      option_a: '[0, 2, 4]',
      option_b: '[2, 4, 6]',
      option_c: '[0, 2, 4, 6]',
      option_d: '[1, 3, 5]',
      correct_option: 'a',
      subject: 'Python',
      difficulty: 'Easy',
      explanation: 'range(6) produces 0, 1, 2, 3, 4, 5. The even numbers filtered by x % 2 == 0 are 0, 2, and 4.'
    }
  ],
  'Machine Learning': [
    {
      question: 'Which metric is calculated as TP / (TP + FP) in binary classification evaluation?',
      option_a: 'Precision',
      option_b: 'Recall (Sensitivity)',
      option_c: 'Specificity',
      option_d: 'F1-Score',
      correct_option: 'a',
      subject: 'Machine Learning',
      difficulty: 'Medium',
      explanation: 'Precision measures the proportion of positive identifications that were actually correct: True Positives divided by total predicted positives (TP + FP).'
    },
    {
      question: 'What is the primary objective of L2 (Ridge) Regularization in regression models?',
      option_a: 'To penalize large weights by adding the squared magnitude of coefficients to the loss function',
      option_b: 'To force insignificant feature weights strictly to absolute zero for sparse feature selection',
      option_c: 'To increase the learning rate dynamically when loss plateaus',
      option_d: 'To convert non-linear boundary lines into linear hyperplanes',
      correct_option: 'a',
      subject: 'Machine Learning',
      difficulty: 'Hard',
      explanation: 'L2 Ridge Regularization adds a penalty proportional to the sum of squared weights (λ Σ w²), shrinking weights toward zero and mitigating overfitting without creating strict sparsity.'
    },
    {
      question: 'In Machine Learning, a model that has high variance and low bias is typically exhibiting:',
      option_a: 'Overfitting',
      option_b: 'Underfitting',
      option_c: 'Optimal Generalization',
      option_d: 'Data Drift',
      correct_option: 'a',
      subject: 'Machine Learning',
      difficulty: 'Easy',
      explanation: 'Overfitting occurs when a complex model captures random training noise rather than the underlying distribution, resulting in low training bias but high test variance.'
    },
    {
      question: 'Which of the following is an unsupervised learning technique?',
      option_a: 'K-Means Clustering',
      option_b: 'Linear Regression',
      option_c: 'Logistic Regression',
      option_d: 'Support Vector Machine (SVM)',
      correct_option: 'a',
      subject: 'Machine Learning',
      difficulty: 'Easy',
      explanation: 'K-Means groups unlabeled feature vectors into K clusters without supervision or target labels.'
    },
    {
      question: 'What mathematical technique does Ordinary Least Squares (OLS) Linear Regression use to minimize error?',
      option_a: 'Minimizing the sum of squared vertical residuals between actual and predicted points',
      option_b: 'Maximizing the margin between support vectors',
      option_c: 'Iteratively pruning decision leaf nodes with high entropy',
      option_d: 'Applying convolution filters to extract spatial features',
      correct_option: 'a',
      subject: 'Machine Learning',
      difficulty: 'Medium',
      explanation: 'OLS fits the best straight line y = mx + c by minimizing the sum of squared differences (residuals) between observed values and the regression line.'
    }
  ],
  Databases: [
    {
      question: 'In relational database transactions, what does the "A" in ACID represent?',
      option_a: 'Atomicity (All operations succeed or the entire transaction is rolled back)',
      option_b: 'Availability (The database responds to every read/write request)',
      option_c: 'Authentication (User credentials must be verified before executing SQL)',
      option_d: 'Asynchronous (Queries are executed in the background)',
      correct_option: 'a',
      subject: 'Databases',
      difficulty: 'Easy',
      explanation: 'Atomicity ensures that database modifications inside a transaction operate as an indivisible unit: either all commit or none take effect.'
    },
    {
      question: 'Which normal form eliminates transitive functional dependencies on non-prime attributes?',
      option_a: 'Third Normal Form (3NF)',
      option_b: 'First Normal Form (1NF)',
      option_c: 'Second Normal Form (2NF)',
      option_d: 'Boyce-Codd Normal Form (BCNF)',
      correct_option: 'a',
      subject: 'Databases',
      difficulty: 'Hard',
      explanation: '3NF requires that a relation is in 2NF and that no non-prime attribute is transitively dependent on the primary key.'
    },
    {
      question: 'What type of index data structure is predominantly used in PostgreSQL and MySQL InnoDB tables for range and equality queries?',
      option_a: 'B+ Tree',
      option_b: 'Hash Map only',
      option_c: 'Singly Linked List',
      option_d: 'Quad Tree',
      correct_option: 'a',
      subject: 'Databases',
      difficulty: 'Medium',
      explanation: 'B+ Trees keep data sorted with high fan-out, providing O(log N) lookup, insertion, deletion, and efficient sequential range traversal.'
    },
    {
      question: 'Which SQL clause is executed AFTER group aggregations to filter grouped records?',
      option_a: 'HAVING',
      option_b: 'WHERE',
      option_c: 'ORDER BY',
      option_d: 'LIMIT',
      correct_option: 'a',
      subject: 'Databases',
      difficulty: 'Easy',
      explanation: 'WHERE filters rows before grouping occurs, while HAVING filters aggregated results (e.g. HAVING COUNT(*) > 5) after GROUP BY.'
    }
  ],
  'Web Development': [
    {
      question: 'In React, what is the primary purpose of the `useEffect` hook dependency array?',
      option_a: 'To control when the side-effect executes based on changes to referenced variables',
      option_b: 'To define initial CSS class names for styling animations',
      option_c: 'To register server-side Express routing endpoints',
      option_d: 'To convert synchronous functions into Web Workers',
      correct_option: 'a',
      subject: 'Web Development',
      difficulty: 'Easy',
      explanation: 'The dependency array tells React to only re-run the effect callback when one of the specified dependencies has changed between renders.'
    },
    {
      question: 'Which HTTP status code signifies that the client must authenticate itself to get the requested response?',
      option_a: '401 Unauthorized',
      option_b: '403 Forbidden',
      option_c: '404 Not Found',
      option_d: '500 Internal Server Error',
      correct_option: 'a',
      subject: 'Web Development',
      difficulty: 'Easy',
      explanation: '401 Unauthorized indicates missing or invalid authentication credentials, whereas 403 Forbidden indicates the server understood credentials but refuses authorization.'
    },
    {
      question: 'Why does React utilize a Virtual DOM rather than directly mutating the browser DOM on every state update?',
      option_a: 'To batch and compute minimal DOM diffs, reducing costly browser reflows and repaints',
      option_b: 'To bypass browser security sandboxes and read local disk files',
      option_c: 'To enable compilation of TypeScript into C++ binaries',
      option_d: 'To prevent users from opening the browser developer console',
      correct_option: 'a',
      subject: 'Web Development',
      difficulty: 'Medium',
      explanation: 'Direct DOM manipulation is computationally expensive. React maintains an in-memory Virtual DOM tree, computes diffs with a reconciliation algorithm, and applies optimal batch updates.'
    }
  ],
  'Data Structures & Algorithms': [
    {
      question: 'What is the average and worst-case time complexity of QuickSort respectively?',
      option_a: 'O(N log N) average, O(N²) worst-case',
      option_b: 'O(N) average, O(N log N) worst-case',
      option_c: 'O(log N) average, O(N) worst-case',
      option_d: 'O(N log N) average, O(N log N) worst-case',
      correct_option: 'a',
      subject: 'Data Structures & Algorithms',
      difficulty: 'Medium',
      explanation: 'QuickSort runs in O(N log N) on average when pivots partition arrays reasonably, but degrades to O(N²) when an unbalanced pivot is chosen continuously (e.g. sorted array with first element as pivot).'
    },
    {
      question: 'Which data structure is fundamentally used for Breadth-First Search (BFS) graph traversal?',
      option_a: 'Queue (FIFO)',
      option_b: 'Stack (LIFO)',
      option_c: 'Max Heap',
      option_d: 'Disjoint Set Union (DSU)',
      correct_option: 'a',
      subject: 'Data Structures & Algorithms',
      difficulty: 'Easy',
      explanation: 'BFS explores nodes level by level using a First-In-First-Out (FIFO) queue data structure.'
    },
    {
      question: 'In a self-balancing AVL Tree, what is the maximum permitted height difference (balance factor) between left and right subtrees?',
      option_a: '1',
      option_b: '0',
      option_c: '2',
      option_d: 'log N',
      correct_option: 'a',
      subject: 'Data Structures & Algorithms',
      difficulty: 'Medium',
      explanation: 'In an AVL tree, the balance factor for every node must be either -1, 0, or +1. If it differs by more than 1, rotations are performed to restore balance.'
    },
    {
      question: 'Which algorithm finds the shortest path between all pairs of vertices in a weighted graph with possible negative edges (no negative cycles)?',
      option_a: 'Floyd-Warshall Algorithm',
      option_b: 'Dijkstra Algorithm',
      option_c: 'Prim Algorithm',
      option_d: 'Kruskal Algorithm',
      correct_option: 'a',
      subject: 'Data Structures & Algorithms',
      difficulty: 'Hard',
      explanation: 'Floyd-Warshall is a dynamic programming algorithm computing all-pairs shortest paths in O(V³) time and supports negative weights provided there are no negative cycles.'
    }
  ],
  'Java': [
    {
      question: 'In Java, which keyword is used to prevent method overriding in derived subclasses?',
      option_a: 'final',
      option_b: 'static',
      option_c: 'abstract',
      option_d: 'synchronized',
      correct_option: 'a',
      subject: 'Java',
      difficulty: 'Easy',
      explanation: 'The final keyword on a method prevents subclasses from overriding it; applied to a class, it prevents inheritance altogether.'
    },
    {
      question: 'What is the key difference between `HashMap` and `ConcurrentHashMap` in Java?',
      option_a: 'ConcurrentHashMap is thread-safe using lock striping without locking the whole table',
      option_b: 'HashMap allows concurrent writes from multiple threads safely',
      option_c: 'ConcurrentHashMap permits null keys and null values, while HashMap does not',
      option_d: 'HashMap is synchronized while ConcurrentHashMap is completely unsynchronized',
      correct_option: 'a',
      subject: 'Java',
      difficulty: 'Medium',
      explanation: 'ConcurrentHashMap provides thread safety with high concurrency by dividing buckets into segments or using CAS/fine-grained synchronizations rather than locking the entire map.'
    },
    {
      question: 'Which Java memory area stores object instances allocated via the `new` operator?',
      option_a: 'Heap Memory',
      option_b: 'Stack Memory',
      option_c: 'Method Area / Metaspace',
      option_d: 'Program Counter (PC) Register',
      correct_option: 'a',
      subject: 'Java',
      difficulty: 'Easy',
      explanation: 'All object instances and array allocations in Java reside in the JVM Heap space, which is managed by the Garbage Collector.'
    }
  ],
  'Operating Systems': [
    {
      question: 'Which condition is NOT one of Coffman\'s four necessary conditions for deadlock to occur?',
      option_a: 'Preemptive Resource Allocation',
      option_b: 'Mutual Exclusion',
      option_c: 'Hold and Wait',
      option_d: 'Circular Wait',
      correct_option: 'a',
      subject: 'Operating Systems',
      difficulty: 'Medium',
      explanation: 'The four Coffman conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Preemptive resource allocation prevents deadlock.'
    },
    {
      question: 'What is the phenomenon called when excessive paging causes an operating system to spend more time swapping pages than executing instructions?',
      option_a: 'Thrashing',
      option_b: 'Belady\'s Anomaly',
      option_c: 'Segmentation Fault',
      option_d: 'Starvation',
      correct_option: 'a',
      subject: 'Operating Systems',
      difficulty: 'Easy',
      explanation: 'Thrashing occurs when the working set of active processes exceeds physical memory, leading to continuous disk paging and degraded CPU utilization.'
    }
  ],
  'Computer Networks': [
    {
      question: 'Which transport layer protocol provides connection-oriented, reliable, byte-stream delivery with flow control and congestion avoidance?',
      option_a: 'TCP (Transmission Control Protocol)',
      option_b: 'UDP (User Datagram Protocol)',
      option_c: 'ICMP (Internet Control Message Protocol)',
      option_d: 'ARP (Address Resolution Protocol)',
      correct_option: 'a',
      subject: 'Computer Networks',
      difficulty: 'Easy',
      explanation: 'TCP establishes a connection via a 3-way handshake and guarantees in-order reliable data delivery using acknowledgments, sequence numbers, and sliding windows.'
    },
    {
      question: 'At which layer of the OSI model does TLS/SSL cryptographic handshaking operate?',
      option_a: 'Presentation Layer (Layer 6) / Transport Security',
      option_b: 'Data Link Layer (Layer 2)',
      option_c: 'Network Layer (Layer 3)',
      option_d: 'Physical Layer (Layer 1)',
      correct_option: 'a',
      subject: 'Computer Networks',
      difficulty: 'Medium',
      explanation: 'TLS encrypts application payload data right above transport protocols (Layer 4) and conceptually maps to the Presentation / Session layers in OSI.'
    }
  ],
  'Cybersecurity': [
    {
      question: 'What type of cryptographic cipher uses distinct public and private keys for encryption and decryption?',
      option_a: 'Asymmetric (Public-Key) Cryptography (e.g. RSA, ECC)',
      option_b: 'Symmetric Block Cipher (e.g. AES-256)',
      option_c: 'One-Time Pad XOR Cipher',
      option_d: 'Cryptographic Hash Function (e.g. SHA-256)',
      correct_option: 'a',
      subject: 'Cybersecurity',
      difficulty: 'Easy',
      explanation: 'Asymmetric encryption relies on mathematically linked key pairs: a public key for encryption and a private key kept secret for decryption.'
    },
    {
      question: 'What security defense is most effective at neutralizing SQL Injection (SQLi) vulnerabilities in web backends?',
      option_a: 'Parameterized queries / Prepared Statements with bound parameters',
      option_b: 'Client-side JavaScript input validation only',
      option_c: 'Base64 encoding user query parameters',
      option_d: 'Using HTTP GET instead of HTTP POST requests',
      correct_option: 'a',
      subject: 'Cybersecurity',
      difficulty: 'Easy',
      explanation: 'Parameterized queries guarantee that the database engine treats user input strictly as literal parameter data rather than executable SQL syntax.'
    }
  ],
  'Cloud & DevOps': [
    {
      question: 'What is the primary architectural purpose of a Container Engine like Docker compared to a traditional Virtual Machine?',
      option_a: 'Sharing the host OS kernel to achieve lightweight, rapid process isolation without hypervisor overhead',
      option_b: 'Emulating physical CPU hardware instructions with full guest operating system kernels',
      option_c: 'Providing automated DNS domain name registration',
      option_d: 'Permanently encrypting local filesystem blocks on hardware SSDs',
      correct_option: 'a',
      subject: 'Cloud & DevOps',
      difficulty: 'Medium',
      explanation: 'Containers share the host operating system kernel using cgroups and namespaces, giving near-instant boot times and lightweight footprint compared to heavy VMs.'
    }
  ],
  'GATE CS & IT': [
    {
      question: 'In Theory of Computation, which of the following formal language families is NOT closed under intersection and complementation?',
      option_a: 'Context-Free Languages (CFL)',
      option_b: 'Regular Languages',
      option_c: 'Deterministic Context-Free Languages (DCFL) under complementation',
      option_d: 'Recursive Languages',
      correct_option: 'a',
      subject: 'GATE CS & IT',
      difficulty: 'Hard',
      explanation: 'Context-Free Languages (CFLs) are closed under union, concatenation, and Kleene star, but are strictly NOT closed under intersection or complementation.'
    },
    {
      question: 'For a cache memory with 64 KB capacity, 32-byte block size, and 4-way set-associativity on a 32-bit physical address space, what is the size of the TAG field?',
      option_a: '18 bits',
      option_b: '16 bits',
      option_c: '20 bits',
      option_d: '14 bits',
      correct_option: 'a',
      subject: 'GATE CS & IT',
      difficulty: 'Hard',
      explanation: 'Offset = log2(32) = 5 bits. Number of lines = 64KB / 32B = 2048. Sets = 2048 / 4 = 512 = 2^9, so Index = 9 bits. Tag bits = 32 - (9 + 5) = 18 bits.'
    },
    {
      question: 'According to the Master Theorem, what is the asymptotic time complexity of the recurrence relation T(n) = 4T(n/2) + O(n^2)?',
      option_a: 'Θ(n^2 log n)',
      option_b: 'Θ(n^2)',
      option_c: 'Θ(n^3)',
      option_d: 'Θ(n log n)',
      correct_option: 'a',
      subject: 'GATE CS & IT',
      difficulty: 'Medium',
      explanation: 'Here a = 4, b = 2, so n^(log_b a) = n^(log_2 4) = n^2. Since f(n) = Θ(n^2), this falls under Case 2 of the Master Theorem, yielding Θ(n^2 log n).'
    },
    {
      question: 'In Relational Database Management Systems (RDBMS), which normal form guarantees both lossless join decomposition and dependency preservation for every relation schema?',
      option_a: 'Third Normal Form (3NF)',
      option_b: 'Boyce-Codd Normal Form (BCNF)',
      option_c: 'Fourth Normal Form (4NF)',
      option_d: 'Fifth Normal Form (5NF)',
      correct_option: 'a',
      subject: 'GATE CS & IT',
      difficulty: 'Medium',
      explanation: '3NF decomposition is always guaranteed to achieve both lossless join and dependency preservation, whereas BCNF cannot always preserve functional dependencies.'
    }
  ],
  'JEE Main & Adv: Physics': [
    {
      question: 'A solid cylinder and a hollow cylinder of identical mass and external radius roll down an inclined plane without slipping from rest. What is the ratio of their translational accelerations (a_solid / a_hollow)?',
      option_a: '4 / 3',
      option_b: '3 / 2',
      option_c: '5 / 4',
      option_d: '1 / 1',
      correct_option: 'a',
      subject: 'JEE Main & Adv: Physics',
      difficulty: 'Hard',
      explanation: 'Translational acceleration a = (g sin θ) / (1 + I / (m R^2)). For solid cylinder, I = 1/2 m R^2 so a_solid = (2/3) g sin θ. For hollow cylinder, I = m R^2 so a_hollow = (1/2) g sin θ. Ratio = (2/3) / (1/2) = 4/3.'
    },
    {
      question: 'In an ideal gas undergoing a reversible adiabatic expansion, if the volume doubles (V2 = 2 V1) and γ = 1.5, what is the ratio of final temperature to initial temperature (T2 / T1)?',
      option_a: '1 / √2',
      option_b: '1 / 2',
      option_c: '√2',
      option_d: '2',
      correct_option: 'a',
      subject: 'JEE Main & Adv: Physics',
      difficulty: 'Medium',
      explanation: 'In adiabatic expansion, T * V^(γ - 1) = constant. Thus T2 / T1 = (V1 / V2)^(γ - 1) = (1/2)^(1.5 - 1) = (1/2)^0.5 = 1 / √2.'
    },
    {
      question: 'In Young\'s Double Slit Experiment (YDSE), if the separation between slits is halved and distance from slits to screen is doubled, what happens to fringe width β?',
      option_a: 'It quadruples (increases by a factor of 4)',
      option_b: 'It doubles (increases by a factor of 2)',
      option_c: 'It remains unchanged',
      option_d: 'It decreases to one-fourth',
      correct_option: 'a',
      subject: 'JEE Main & Adv: Physics',
      difficulty: 'Easy',
      explanation: 'Fringe width β = (λ * D) / d. If D becomes 2D and d becomes d/2, then β\' = (λ * 2D) / (d/2) = 4 * ((λ * D) / d) = 4β.'
    }
  ],
  'Mathematics': [
    {
      question: 'Evaluate the definite integral I = ∫[0 to π/2] (sin^3(x) / (sin^3(x) + cos^3(x))) dx:',
      option_a: 'π / 4',
      option_b: 'π / 2',
      option_c: 'π / 8',
      option_d: '1',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Medium',
      explanation: 'By King\'s property of definite integrals, ∫[0 to a] f(x) dx = ∫[0 to a] f(a - x) dx. Adding both representations gives 2I = ∫[0 to π/2] 1 dx = π/2, hence I = π/4.'
    },
    {
      question: 'What is the integrating factor (I.F.) for the first-order linear differential equation dy/dx + (2x / (1 + x^2)) y = (x^3 / (1 + x^2))?',
      option_a: '1 + x^2',
      option_b: 'ln(1 + x^2)',
      option_c: 'e^(2x)',
      option_d: '1 / (1 + x^2)',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Easy',
      explanation: 'I.F. = exp(∫ P(x) dx) = exp(∫ (2x / (1 + x^2)) dx) = exp(ln(1 + x^2)) = 1 + x^2.'
    },
    {
      question: 'Evaluate the limit: L = lim(x → 0) [ (e^x - 1 - x) / x^2 ]:',
      option_a: '1 / 2',
      option_b: '1',
      option_c: '0',
      option_d: '∞',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Medium',
      explanation: 'Applying L\'Hopital\'s rule twice: 1st derivative gives (e^x - 1)/(2x). 2nd derivative gives e^x / 2. As x → 0, L = e^0 / 2 = 1/2.'
    },
    {
      question: 'At which point does the cubic function f(x) = 2x^3 - 9x^2 + 12x + 5 attain a local minimum?',
      option_a: 'x = 2',
      option_b: 'x = 1',
      option_c: 'x = 3',
      option_d: 'x = 0',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Medium',
      explanation: 'f\'(x) = 6x^2 - 18x + 12 = 6(x - 1)(x - 2) = 0 => critical points at x = 1, 2. Second derivative f\'\'(x) = 12x - 18. At x = 2, f\'\'(2) = 24 - 18 = 6 > 0 (concave up, local minimum). At x = 1, f\'\'(1) = -6 < 0 (local maximum).'
    },
    {
      question: 'What is the area of the finite region bounded by the parabola y = x^2 and the line y = 4?',
      option_a: '32 / 3',
      option_b: '16 / 3',
      option_c: '8',
      option_d: '64 / 3',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Medium',
      explanation: 'Intersection points: x^2 = 4 => x = -2 and x = 2. Area = ∫[-2 to 2] (4 - x^2) dx = 2 * [4x - x^3 / 3] from 0 to 2 = 2 * (8 - 8/3) = 2 * (16/3) = 32/3.'
    },
    {
      question: 'What is the derivative of f(x) = ln|sec(x) + tan(x)| with respect to x?',
      option_a: 'sec(x)',
      option_b: 'tan(x)',
      option_c: 'sec^2(x)',
      option_d: 'sec(x) tan(x)',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Easy',
      explanation: 'd/dx[ln(sec x + tan x)] = (1 / (sec x + tan x)) * (sec x tan x + sec^2 x) = (sec x (tan x + sec x)) / (sec x + tan x) = sec x.'
    },
    {
      question: 'What is the general solution of the homogeneous second-order linear ODE: (d^2 y / dx^2) + 9y = 0?',
      option_a: 'y(x) = C1 cos(3x) + C2 sin(3x)',
      option_b: 'y(x) = C1 e^(3x) + C2 e^(-3x)',
      option_c: 'y(x) = (C1 + C2 x) e^(3x)',
      option_d: 'y(x) = C1 cos(9x) + C2 sin(9x)',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Easy',
      explanation: 'Characteristic equation r^2 + 9 = 0 => r = ±3i. Roots are purely imaginary α ± iβ with α = 0, β = 3. Hence y(x) = C1 cos(3x) + C2 sin(3x).'
    },
    {
      question: 'What are the eigenvalues of the 2x2 matrix A = [[4, 1], [2, 3]]?',
      option_a: 'λ1 = 5, λ2 = 2',
      option_b: 'λ1 = 4, λ2 = 3',
      option_c: 'λ1 = 6, λ2 = 1',
      option_d: 'λ1 = 7, λ2 = 0',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Medium',
      explanation: 'det(A - λI) = (4 - λ)(3 - λ) - 2 = λ^2 - 7λ + 12 - 2 = λ^2 - 7λ + 10 = (λ - 5)(λ - 2) = 0. Thus eigenvalues are λ = 5 and λ = 2.'
    },
    {
      question: 'For any square matrix M of dimension n x n, what is the trace Tr(M) strictly equal to?',
      option_a: 'The sum of all its eigenvalues',
      option_b: 'The product of all its eigenvalues',
      option_c: 'The determinant of matrix M',
      option_d: 'The rank of matrix M',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Easy',
      explanation: 'The trace is the sum of the main diagonal elements, and by linear algebra theorem, Tr(M) equals the sum of all eigenvalues counted with multiplicity.'
    },
    {
      question: 'If A is an invertible matrix with determinant det(A) = 4, what is the determinant of its inverse det(A^-1)?',
      option_a: '0.25 (1/4)',
      option_b: '-4',
      option_c: '16',
      option_d: '1',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Easy',
      explanation: 'Because A * A^-1 = I, det(A) * det(A^-1) = det(I) = 1. Therefore det(A^-1) = 1 / det(A) = 1/4 = 0.25.'
    },
    {
      question: 'If a random variable X follows a Poisson distribution with parameter λ = 6, what is its variance Var(X)?',
      option_a: '6',
      option_b: '36',
      option_c: '√6',
      option_d: '12',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Easy',
      explanation: 'In a Poisson distribution with parameter λ, both the expected value E[X] and variance Var(X) are identically equal to λ. Therefore Var(X) = 6.'
    },
    {
      question: 'For the quadratic equation 2x^2 - 8x + 5 = 0 with roots α and β, what is the exact value of (α^2 + β^2)?',
      option_a: '11',
      option_b: '16',
      option_c: '6',
      option_d: '9',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Medium',
      explanation: 'By Vieta\'s formulas, α + β = -(-8)/2 = 4 and αβ = 5/2 = 2.5. Then α^2 + β^2 = (α + β)^2 - 2αβ = 4^2 - 2(2.5) = 16 - 5 = 11.'
    },
    {
      question: 'What is the remainder when 3^2022 is divided by 7?',
      option_a: '1',
      option_b: '3',
      option_c: '2',
      option_d: '5',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Hard',
      explanation: 'By Fermat\'s Little Theorem, 3^(7-1) = 3^6 ≡ 1 (mod 7). Since 2022 = 6 * 337 + 0, 3^2022 = (3^6)^337 ≡ 1^337 ≡ 1 (mod 7).'
    },
    {
      question: 'What is the principal argument Arg(z) of the complex number z = -1 + i√3?',
      option_a: '2π / 3 (120°)',
      option_b: 'π / 3 (60°)',
      option_c: '5π / 6 (150°)',
      option_d: '-2π / 3 (-120°)',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Medium',
      explanation: 'z is in the 2nd quadrant (Re(z) < 0, Im(z) > 0). Arg(z) = π - arctan(|√3 / -1|) = π - π/3 = 2π/3.'
    },
    {
      question: 'What is the eccentricity e of the ellipse given by the Cartesian equation (x^2 / 25) + (y^2 / 16) = 1?',
      option_a: '3 / 5 (0.6)',
      option_b: '4 / 5 (0.8)',
      option_c: '9 / 25 (0.36)',
      option_d: '16 / 25 (0.64)',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Easy',
      explanation: 'For an ellipse with a^2 = 25 (a = 5) and b^2 = 16 (b = 4), eccentricity e = √(1 - b^2 / a^2) = √(1 - 16/25) = √(9/25) = 3/5 = 0.6.'
    },
    {
      question: 'If vectors u = 2i + 3j - k and v = i - 2j + 4k, what is their scalar dot product u · v?',
      option_a: '-8',
      option_b: '8',
      option_c: '-4',
      option_d: '12',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Easy',
      explanation: 'u · v = (2)(1) + (3)(-2) + (-1)(4) = 2 - 6 - 4 = -8.'
    },
    {
      question: 'What is the sum of the infinite convergent geometric series: S = 6 + 3 + 1.5 + 0.75 + ...?',
      option_a: '12',
      option_b: '9',
      option_c: '18',
      option_d: '24',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Easy',
      explanation: 'First term a = 6, common ratio r = 3/6 = 0.5. Since |r| < 1, S = a / (1 - r) = 6 / (1 - 0.5) = 6 / 0.5 = 12.'
    },
    {
      question: 'How many distinct permutations of the letters in the word "ENGINEERING" can be formed?',
      option_a: '277,200',
      option_b: '39,916,800',
      option_c: '55,440',
      option_d: '1,663,200',
      correct_option: 'a',
      subject: 'Mathematics',
      difficulty: 'Hard',
      explanation: 'Total letters = 11. Frequencies: E: 3, N: 3, G: 2, I: 2, R: 1. Permutations = 11! / (3! * 3! * 2! * 2! * 1!) = 39,916,800 / (6 * 6 * 2 * 2) = 39,916,800 / 144 = 277,200.'
    }
  ],
  'JEE Main & Adv: Mathematics': [
    {
      question: 'Evaluate the definite integral I = ∫[0 to π/2] (sin^3(x) / (sin^3(x) + cos^3(x))) dx:',
      option_a: 'π / 4',
      option_b: 'π / 2',
      option_c: 'π / 8',
      option_d: '1',
      correct_option: 'a',
      subject: 'JEE Main & Adv: Mathematics',
      difficulty: 'Medium',
      explanation: 'By King\'s property of definite integrals, ∫[0 to a] f(x) dx = ∫[0 to a] f(a - x) dx. Adding both representations gives 2I = ∫[0 to π/2] 1 dx = π/2, hence I = π/4.'
    },
    {
      question: 'What is the integrating factor (I.F.) for the first-order linear differential equation dy/dx + (2x / (1 + x^2)) y = (x^3 / (1 + x^2))?',
      option_a: '1 + x^2',
      option_b: 'ln(1 + x^2)',
      option_c: 'e^(2x)',
      option_d: '1 / (1 + x^2)',
      correct_option: 'a',
      subject: 'JEE Main & Adv: Mathematics',
      difficulty: 'Easy',
      explanation: 'I.F. = exp(∫ P(x) dx) = exp(∫ (2x / (1 + x^2)) dx) = exp(ln(1 + x^2)) = 1 + x^2.'
    }
  ],
  'JEE Main & Adv: Chemistry': [
    {
      question: 'Which of the following alkyl halides undergoes nucleophilic substitution via the SN1 mechanism with the highest reaction rate?',
      option_a: 'tert-Butyl bromide ( (CH3)3C-Br )',
      option_b: 'Isopropyl bromide ( (CH3)2CH-Br )',
      option_c: 'Ethyl bromide ( CH3CH2-Br )',
      option_d: 'Methyl bromide ( CH3-Br )',
      correct_option: 'a',
      subject: 'JEE Main & Adv: Chemistry',
      difficulty: 'Medium',
      explanation: 'SN1 reaction rate is determined by carbocation intermediate stability. Tertiary (3°) carbocation (CH3)3C+ is hyperconjugation-stabilized and formed fastest.'
    },
    {
      question: 'According to Crystal Field Theory, what is the crystal field stabilization energy (CFSE) for a high-spin d^6 octahedral complex?',
      option_a: '-0.4 Δo',
      option_b: '-2.4 Δo + 2P',
      option_c: '-0.6 Δo',
      option_d: '0.0 Δo',
      correct_option: 'a',
      subject: 'JEE Main & Adv: Chemistry',
      difficulty: 'Hard',
      explanation: 'In high-spin octahedral d^6, electron configuration is t2g^4 eg^2. CFSE = 4 * (-0.4 Δo) + 2 * (+0.6 Δo) = -1.6 Δo + 1.2 Δo = -0.4 Δo.'
    }
  ],
  'NEET: Pre-Medical Biology': [
    {
      question: 'In a classical Mendelian dihybrid cross between heterozygous round yellow seeded pea plants (RrYy x RrYy), what is the phenotypic ratio observed in the F2 generation?',
      option_a: '9 : 3 : 3 : 1',
      option_b: '1 : 2 : 1',
      option_c: '9 : 7',
      option_d: '15 : 1',
      correct_option: 'a',
      subject: 'NEET: Pre-Medical Biology',
      difficulty: 'Easy',
      explanation: 'Mendel\'s Law of Independent Assortment produces 9 Round Yellow : 3 Round Green : 3 Wrinkled Yellow : 1 Wrinkled Green in the F2 dihybrid generation.'
    },
    {
      question: 'Which enzyme is primarily responsible for unzipping and separating double-stranded DNA at the replication fork in eukaryotic cells?',
      option_a: 'DNA Helicase',
      option_b: 'DNA Topoisomerase (Gyrase)',
      option_c: 'DNA Ligase',
      option_d: 'RNA Primase',
      correct_option: 'a',
      subject: 'NEET: Pre-Medical Biology',
      difficulty: 'Easy',
      explanation: 'DNA Helicase breaks the hydrogen bonds between complementary base pairs to unwind the double helix, creating the replication fork.'
    }
  ],
  'CAT / GMAT: Quantitative Aptitude': [
    {
      question: 'A train 180 meters long running at 72 km/h crosses a platform in 20 seconds. What is the length of the platform?',
      option_a: '220 meters',
      option_b: '200 meters',
      option_c: '240 meters',
      option_d: '180 meters',
      correct_option: 'a',
      subject: 'CAT / GMAT: Quantitative Aptitude',
      difficulty: 'Medium',
      explanation: 'Speed = 72 * (5/18) = 20 m/s. Total distance in 20 seconds = 20 * 20 = 400 meters. Length of platform = 400 - 180 = 220 meters.'
    },
    {
      question: 'If Pipe A can fill a tank in 12 hours and Pipe B can fill it in 18 hours, how long will it take to fill the tank if both pipes are opened simultaneously?',
      option_a: '7 hours 12 minutes (7.2 hours)',
      option_b: '8 hours',
      option_c: '6 hours 30 minutes',
      option_d: '7 hours 30 minutes',
      correct_option: 'a',
      subject: 'CAT / GMAT: Quantitative Aptitude',
      difficulty: 'Easy',
      explanation: 'Combined rate = 1/12 + 1/18 = (3 + 2)/36 = 5/36. Time taken = 36/5 = 7.2 hours = 7 hours 12 minutes.'
    }
  ],
  'UPSC / CSE: General Studies': [
    {
      question: 'Under which Article of the Constitution of India can a citizen directly move the Supreme Court of India for the enforcement of Fundamental Rights via constitutional remedies?',
      option_a: 'Article 32',
      option_b: 'Article 226',
      option_c: 'Article 14',
      option_d: 'Article 19',
      correct_option: 'a',
      subject: 'UPSC / CSE: General Studies',
      difficulty: 'Easy',
      explanation: 'Article 32 provides the right to constitutional remedies via Supreme Court writs (Habeas Corpus, Mandamus, Prohibition, Quo-Warranto, Certiorari), described by Dr. Ambedkar as the Heart and Soul of the Constitution.'
    },
    {
      question: 'Which policy tool is deployed by the Reserve Bank of India (RBI) when it sells government securities in the open market to absorb excess liquidity from the commercial banking system?',
      option_a: 'Open Market Operations (OMO)',
      option_b: 'Marginal Standing Facility (MSF)',
      option_c: 'Statutory Liquidity Ratio (SLR) reduction',
      option_d: 'Targeted Long Term Repo Operations (TLTRO)',
      correct_option: 'a',
      subject: 'UPSC / CSE: General Studies',
      difficulty: 'Medium',
      explanation: 'Open Market Operations (OMO) involve the outright sale or purchase of government securities by the central bank to control liquidity and interest rates.'
    }
  ]
};

/**
 * Specialized procedural generator for Trigonometry:
 * - Compound Angles: sin(A+B), sin(A-B), cos(A+B), cos(A-B), tan(A+B), tan(A-B)
 * - Multiple Angles: sin(2θ), cos(2θ), tan(2θ), sin(3θ), cos(3θ), tan(3θ)
 * - Numerical evaluations, exact angle values (15°, 75°), transformation formulas.
 * Guarantees distinct options, rotating correct answer positions, and detailed explanations.
 */
function generateProceduralTrigonometryQuestions(
  prompt: string,
  neededCount: number,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  subjectName: string
): GeneratedQuestion[] {
  const list: GeneratedQuestion[] = [];
  const optionLetters: ('a' | 'b' | 'c' | 'd')[] = ['a', 'b', 'c', 'd'];

  const generators = [
    // 1. Double Angle: sin(2θ) expansion
    () => ({
      q: 'Which of the following is the standard identity for sin(2θ) in terms of sin(θ) and cos(θ)?',
      correct: '2 sin(θ) cos(θ)',
      w1: 'sin²(θ) - cos²(θ)',
      w2: '2 sin(θ)',
      w3: 'cos²(θ) + sin²(θ)',
      exp: 'From the compound angle addition formula: sin(2θ) = sin(θ + θ) = sin(θ)cos(θ) + cos(θ)sin(θ) = 2 sin(θ) cos(θ).'
    }),

    // 2. Double Angle: sin(2θ) in terms of tan(θ)
    () => ({
      q: 'Express sin(2θ) purely in terms of tan(θ):',
      correct: '(2 tan(θ)) / (1 + tan²(θ))',
      w1: '(2 tan(θ)) / (1 - tan²(θ))',
      w2: '(1 - tan²(θ)) / (1 + tan²(θ))',
      w3: 'tan(θ) / (1 + tan²(θ))',
      exp: 'sin(2θ) = 2sin(θ)cos(θ) = (2sin(θ)cos(θ)) / (cos²(θ) + sin²(θ)). Dividing numerator and denominator by cos²(θ) yields (2 tan(θ)) / (1 + tan²(θ)).'
    }),

    // 3. Double Angle: cos(2θ) fundamental forms
    () => ({
      q: 'Which of the following expressions is NOT identically equivalent to cos(2θ)?',
      correct: '2 sin²(θ) - 1',
      w1: 'cos²(θ) - sin²(θ)',
      w2: '2 cos²(θ) - 1',
      w3: '1 - 2 sin²(θ)',
      exp: 'cos(2θ) = cos²(θ) - sin²(θ) = 2cos²(θ) - 1 = 1 - 2sin²(θ). The expression 2sin²(θ) - 1 is equal to -cos(2θ).'
    }),

    // 4. Double Angle: cos(2θ) in terms of tan(θ)
    () => ({
      q: 'What is the expression for cos(2θ) written in terms of tan(θ)?',
      correct: '(1 - tan²(θ)) / (1 + tan²(θ))',
      w1: '(1 + tan²(θ)) / (1 - tan²(θ))',
      w2: '(2 tan(θ)) / (1 - tan²(θ))',
      w3: '(2 tan(θ)) / (1 + tan²(θ))',
      exp: 'cos(2θ) = (cos²(θ) - sin²(θ)) / (cos²(θ) + sin²(θ)). Dividing both terms by cos²(θ) gives (1 - tan²(θ)) / (1 + tan²(θ)).'
    }),

    // 5. Double Angle: tan(2θ)
    () => ({
      q: 'What is the standard double-angle formula for tan(2θ) in terms of tan(θ)?',
      correct: '(2 tan(θ)) / (1 - tan²(θ))',
      w1: '(2 tan(θ)) / (1 + tan²(θ))',
      w2: '(1 - tan²(θ)) / (2 tan(θ))',
      w3: '(tan²(θ) - 1) / (2 tan(θ))',
      exp: 'Using tan(A + B) = (tan A + tan B) / (1 - tan A tan B) with A = B = θ: tan(2θ) = (2 tan(θ)) / (1 - tan²(θ)).'
    }),

    // 6. Triple Angle: sin(3θ)
    () => ({
      q: 'What is the expansion of sin(3θ) in terms of powers of sin(θ)?',
      correct: '3 sin(θ) - 4 sin³(θ)',
      w1: '4 sin³(θ) - 3 sin(θ)',
      w2: '3 sin(θ) + 4 sin³(θ)',
      w3: '4 cos³(θ) - 3 cos(θ)',
      exp: 'sin(3θ) = sin(2θ + θ) = sin(2θ)cos(θ) + cos(2θ)sin(θ) = 2sin(θ)cos²(θ) + (1 - 2sin²(θ))sin(θ) = 2sin(θ)(1 - sin²(θ)) + sin(θ) - 2sin³(θ) = 3 sin(θ) - 4 sin³(θ).'
    }),

    // 7. Triple Angle: cos(3θ)
    () => ({
      q: 'What is the expansion of cos(3θ) in terms of powers of cos(θ)?',
      correct: '4 cos³(θ) - 3 cos(θ)',
      w1: '3 cos(θ) - 4 cos³(θ)',
      w2: '4 cos³(θ) + 3 cos(θ)',
      w3: '3 sin(θ) - 4 sin³(θ)',
      exp: 'cos(3θ) = cos(2θ + θ) = cos(2θ)cos(θ) - sin(2θ)sin(θ) = (2cos²(θ) - 1)cos(θ) - 2sin²(θ)cos(θ) = 2cos³(θ) - cos(θ) - 2(1 - cos²(θ))cos(θ) = 4 cos³(θ) - 3 cos(θ).'
    }),

    // 8. Triple Angle: tan(3θ)
    () => ({
      q: 'Which expression represents the triple-angle expansion of tan(3θ)?',
      correct: '(3 tan(θ) - tan³(θ)) / (1 - 3 tan²(θ))',
      w1: '(3 tan(θ) + tan³(θ)) / (1 - 3 tan²(θ))',
      w2: '(3 tan²(θ) - 1) / (1 - 3 tan(θ))',
      w3: '(3 tan(θ) - tan³(θ)) / (1 + 3 tan²(θ))',
      exp: 'tan(3θ) = tan(2θ + θ) = (tan 2θ + tan θ) / (1 - tan 2θ tan θ). Substituting tan 2θ = 2tan θ / (1 - tan² θ) simplifies to (3 tan(θ) - tan³(θ)) / (1 - 3 tan²(θ)).'
    }),

    // 9. Compound Angle: sin(A + B)
    () => ({
      q: 'According to the compound angle addition theorem, sin(A + B) is equal to:',
      correct: 'sin(A) cos(B) + cos(A) sin(B)',
      w1: 'sin(A) cos(B) - cos(A) sin(B)',
      w2: 'cos(A) cos(B) - sin(A) sin(B)',
      w3: 'cos(A) cos(B) + sin(A) sin(B)',
      exp: 'By the fundamental trigonometric addition theorem for sine: sin(A + B) = sin(A)cos(B) + cos(A)sin(B).'
    }),

    // 10. Compound Angle: sin(A - B)
    () => ({
      q: 'What is the compound angle identity for sin(A - B)?',
      correct: 'sin(A) cos(B) - cos(A) sin(B)',
      w1: 'sin(A) cos(B) + cos(A) sin(B)',
      w2: 'cos(A) cos(B) + sin(A) sin(B)',
      w3: 'cos(A) cos(B) - sin(A) sin(B)',
      exp: 'sin(A - B) = sin(A + (-B)) = sin(A)cos(-B) + cos(A)sin(-B). Since cos(-B) = cos(B) and sin(-B) = -sin(B), sin(A - B) = sin(A)cos(B) - cos(A)sin(B).'
    }),

    // 11. Compound Angle: cos(A + B)
    () => ({
      q: 'According to the compound angle theorem, cos(A + B) is equal to:',
      correct: 'cos(A) cos(B) - sin(A) sin(B)',
      w1: 'cos(A) cos(B) + sin(A) sin(B)',
      w2: 'sin(A) cos(B) + cos(A) sin(B)',
      w3: 'sin(A) sin(B) - cos(A) cos(B)',
      exp: 'The compound angle identity for cosine has a minus sign: cos(A + B) = cos(A)cos(B) - sin(A)sin(B).'
    }),

    // 12. Compound Angle: cos(A - B)
    () => ({
      q: 'What is the compound angle expansion of cos(A - B)?',
      correct: 'cos(A) cos(B) + sin(A) sin(B)',
      w1: 'cos(A) cos(B) - sin(A) sin(B)',
      w2: 'sin(A) cos(B) - cos(A) sin(B)',
      w3: 'sin(A) sin(B) - cos(A) cos(B)',
      exp: 'cos(A - B) = cos(A + (-B)) = cos(A)cos(-B) - sin(A)sin(-B) = cos(A)cos(B) + sin(A)sin(B).'
    }),

    // 13. Compound Angle: tan(A + B)
    () => ({
      q: 'What is the addition formula for tan(A + B)?',
      correct: '(tan(A) + tan(B)) / (1 - tan(A) tan(B))',
      w1: '(tan(A) - tan(B)) / (1 + tan(A) tan(B))',
      w2: '(tan(A) + tan(B)) / (1 + tan(A) tan(B))',
      w3: '(1 - tan(A) tan(B)) / (tan(A) + tan(B))',
      exp: 'tan(A + B) = sin(A + B)/cos(A + B) = (sin A cos B + cos A sin B)/(cos A cos B - sin A sin B). Dividing throughout by cos A cos B gives (tan A + tan B)/(1 - tan A tan B).'
    }),

    // 14. Compound Angle: tan(A - B)
    () => ({
      q: 'What is the subtraction formula for tan(A - B)?',
      correct: '(tan(A) - tan(B)) / (1 + tan(A) tan(B))',
      w1: '(tan(A) + tan(B)) / (1 - tan(A) tan(B))',
      w2: '(tan(A) - tan(B)) / (1 - tan(A) tan(B))',
      w3: '(1 + tan(A) tan(B)) / (tan(A) - tan(B))',
      exp: 'Replacing B with -B in tan(A + B): tan(A - B) = (tan A - tan B) / (1 + tan A tan B).'
    }),

    // 15. Exact Value: sin(75°)
    () => ({
      q: 'Using the compound angle identity sin(45° + 30°), what is the exact value of sin(75°)?',
      correct: '(√6 + √2) / 4',
      w1: '(√6 - √2) / 4',
      w2: '(√3 + 1) / 2',
      w3: '(√2 + 1) / 4',
      exp: 'sin(75°) = sin(45° + 30°) = sin(45°)cos(30°) + cos(45°)sin(30°) = (√2/2)(√3/2) + (√2/2)(1/2) = (√6 + √2)/4.'
    }),

    // 16. Exact Value: cos(75°)
    () => ({
      q: 'Evaluate the exact value of cos(75°) using the compound angle formula cos(45° + 30°):',
      correct: '(√6 - √2) / 4',
      w1: '(√6 + √2) / 4',
      w2: '(√3 - 1) / 2',
      w3: '(1 - √2) / 4',
      exp: 'cos(75°) = cos(45° + 30°) = cos(45°)cos(30°) - sin(45°)sin(30°) = (√2/2)(√3/2) - (√2/2)(1/2) = (√6 - √2)/4.'
    }),

    // 17. Exact Value: sin(15°)
    () => ({
      q: 'Compute the exact value of sin(15°) using the compound angle identity sin(45° - 30°):',
      correct: '(√6 - √2) / 4',
      w1: '(√6 + √2) / 4',
      w2: '(√3 - 1) / 2√2',
      w3: '(√2 - 1) / 4',
      exp: 'sin(15°) = sin(45° - 30°) = sin(45°)cos(30°) - cos(45°)sin(30°) = (√2/2)(√3/2) - (√2/2)(1/2) = (√6 - √2)/4.'
    }),

    // 18. Exact Value: cos(15°)
    () => ({
      q: 'What is the exact value of cos(15°)?',
      correct: '(√6 + √2) / 4',
      w1: '(√6 - √2) / 4',
      w2: '(√3 + 1) / 2√2',
      w3: '(√3 - 1) / 4',
      exp: 'cos(15°) = cos(45° - 30°) = cos(45°)cos(30°) + sin(45°)sin(30°) = (√2/2)(√3/2) + (√2/2)(1/2) = (√6 + √2)/4.'
    }),

    // 19. Exact Value: tan(75°)
    () => ({
      q: 'What is the exact simplified value of tan(75°)?',
      correct: '2 + √3',
      w1: '2 - √3',
      w2: '1 + √3',
      w3: '√3 - 1',
      exp: 'tan(75°) = tan(45° + 30°) = (1 + 1/√3)/(1 - 1/√3) = (√3 + 1)/(√3 - 1). Rationalizing gives (√3 + 1)²/2 = (4 + 2√3)/2 = 2 + √3.'
    }),

    // 20. Exact Value: tan(15°)
    () => ({
      q: 'What is the exact simplified value of tan(15°)?',
      correct: '2 - √3',
      w1: '2 + √3',
      w2: '√3 - 1',
      w3: '3 - √2',
      exp: 'tan(15°) = tan(45° - 30°) = (1 - 1/√3)/(1 + 1/√3) = (√3 - 1)/(√3 + 1). Rationalizing gives (√3 - 1)²/2 = (4 - 2√3)/2 = 2 - √3.'
    }),

    // 21. Numerical Problem: sin(2θ) given sin(θ) = 3/5
    () => ({
      q: 'If sin(θ) = 3/5 and θ is in the first quadrant (0 < θ < π/2), what is the exact value of sin(2θ)?',
      correct: '24 / 25',
      w1: '12 / 25',
      w2: '7 / 25',
      w3: '6 / 5',
      exp: 'In quadrant I, cos(θ) = √(1 - sin²θ) = √(1 - 9/25) = 4/5. Then sin(2θ) = 2 sin(θ) cos(θ) = 2 × (3/5) × (4/5) = 24/25.'
    }),

    // 22. Numerical Problem: cos(2θ) given cos(θ) = 4/5
    () => ({
      q: 'If cos(θ) = 4/5 and θ is acute, what is the value of cos(2θ)?',
      correct: '7 / 25',
      w1: '24 / 25',
      w2: '16 / 25',
      w3: '9 / 25',
      exp: 'Using the identity cos(2θ) = 2cos²(θ) - 1: cos(2θ) = 2(4/5)² - 1 = 2(16/25) - 1 = 32/25 - 1 = 7/25.'
    }),

    // 23. Numerical Problem: tan(A + B) given tan(A) = 1/2, tan(B) = 1/3
    () => ({
      q: 'If tan(A) = 1/2 and tan(B) = 1/3, what is the exact value of tan(A + B)?',
      correct: '1 (which implies A + B = 45°)',
      w1: '5 / 6',
      w2: '1 / 6',
      w3: '2 / 3',
      exp: 'tan(A + B) = (tan A + tan B) / (1 - tan A tan B) = (1/2 + 1/3) / (1 - (1/2)(1/3)) = (5/6) / (1 - 1/6) = (5/6) / (5/6) = 1.'
    }),

    // 24. Numerical Problem: sin(3θ) given sin(θ) = 1/2
    () => ({
      q: 'If sin(θ) = 1/2, evaluate sin(3θ) using the triple-angle formula:',
      correct: '1',
      w1: '1 / 2',
      w2: '0',
      w3: '√3 / 2',
      exp: 'sin(3θ) = 3sin(θ) - 4sin³(θ) = 3(1/2) - 4(1/2)³ = 3/2 - 4(1/8) = 3/2 - 1/2 = 1. (Note: θ = 30°, so 3θ = 90° and sin(90°) = 1).'
    }),

    // 25. Numerical Problem: cos(3θ) given cos(θ) = 1/2
    () => ({
      q: 'If cos(θ) = 1/2, what is the exact value of cos(3θ)?',
      correct: '-1',
      w1: '1',
      w2: '0',
      w3: '-1 / 2',
      exp: 'cos(3θ) = 4cos³(θ) - 3cos(θ) = 4(1/2)³ - 3(1/2) = 4(1/8) - 3/2 = 1/2 - 3/2 = -1. (Note: θ = 60°, so 3θ = 180° and cos(180°) = -1).'
    }),

    // 26. Product to Sum: 2 sin(A) cos(B)
    () => ({
      q: 'Express the product 2 sin(A) cos(B) as a sum or difference of trigonometric functions:',
      correct: 'sin(A + B) + sin(A - B)',
      w1: 'sin(A + B) - sin(A - B)',
      w2: 'cos(A + B) + cos(A - B)',
      w3: 'cos(A - B) - cos(A + B)',
      exp: 'sin(A + B) + sin(A - B) = (sin A cos B + cos A sin B) + (sin A cos B - cos A sin B) = 2 sin A cos B.'
    }),

    // 27. Product to Sum: 2 cos(A) cos(B)
    () => ({
      q: 'Express the product 2 cos(A) cos(B) in sum-difference form:',
      correct: 'cos(A + B) + cos(A - B)',
      w1: 'cos(A + B) - cos(A - B)',
      w2: 'sin(A + B) + sin(A - B)',
      w3: 'sin(A + B) - sin(A - B)',
      exp: 'cos(A + B) + cos(A - B) = (cos A cos B - sin A sin B) + (cos A cos B + sin A sin B) = 2 cos A cos B.'
    }),

    // 28. Product to Sum: 2 sin(A) sin(B)
    () => ({
      q: 'Which expression is identically equal to 2 sin(A) sin(B)?',
      correct: 'cos(A - B) - cos(A + B)',
      w1: 'cos(A + B) - cos(A - B)',
      w2: 'sin(A + B) - sin(A - B)',
      w3: 'sin(A + B) + sin(A - B)',
      exp: 'cos(A - B) - cos(A + B) = (cos A cos B + sin A sin B) - (cos A cos B - sin A sin B) = 2 sin A sin B.'
    }),

    // 29. Identity: sin(A + B) sin(A - B)
    () => ({
      q: 'What is the product sin(A + B) sin(A - B) identically equal to?',
      correct: 'sin²(A) - sin²(B)',
      w1: 'sin²(A) + sin²(B)',
      w2: 'cos²(A) - cos²(B)',
      w3: 'cos²(A) - sin²(B)',
      exp: 'sin(A + B)sin(A - B) = (sin A cos B + cos A sin B)(sin A cos B - cos A sin B) = sin²A cos²B - cos²A sin²B = sin²A(1 - sin²B) - (1 - sin²A)sin²B = sin²A - sin²B.'
    }),

    // 30. Evaluation: cos(20°) cos(40°) cos(80°)
    () => ({
      q: 'What is the exact product value of cos(20°) cos(40°) cos(80°)?',
      correct: '1 / 8',
      w1: '1 / 4',
      w2: '1 / 16',
      w3: '3 / 8',
      exp: 'Using the continuous product identity cos(θ)cos(2θ)cos(4θ) = sin(8θ)/(8 sin θ) with θ = 20°: sin(160°)/(8 sin 20°) = sin(180° - 20°)/(8 sin 20°) = sin(20°)/(8 sin 20°) = 1/8.'
    }),

    // 31. Conditional Identity: tan(A) + tan(B) + tan(C) in a triangle
    () => ({
      q: 'In any triangle ABC where A + B + C = 180°, what does tan(A) + tan(B) + tan(C) equal?',
      correct: 'tan(A) tan(B) tan(C)',
      w1: '1',
      w2: '0',
      w3: 'tan(A + B + C)',
      exp: 'Since A + B = 180° - C, tan(A + B) = tan(180° - C) = -tan(C). Expanding (tan A + tan B)/(1 - tan A tan B) = -tan C gives tan A + tan B + tan C = tan A tan B tan C.'
    }),

    // 32. Double Angle reduction: 1 - cos(2θ)
    () => ({
      q: 'Express (1 - cos(2θ)) / 2 in terms of sin(θ):',
      correct: 'sin²(θ)',
      w1: 'cos²(θ)',
      w2: '2 sin²(θ)',
      w3: 'sin(θ)',
      exp: 'Since cos(2θ) = 1 - 2sin²(θ), rearranging gives 2sin²(θ) = 1 - cos(2θ), therefore (1 - cos(2θ)) / 2 = sin²(θ).'
    }),

    // 33. Double Angle reduction: 1 + cos(2θ)
    () => ({
      q: 'Express (1 + cos(2θ)) / 2 in terms of cos(θ):',
      correct: 'cos²(θ)',
      w1: 'sin²(θ)',
      w2: '2 cos²(θ)',
      w3: 'cos(θ)',
      exp: 'Since cos(2θ) = 2cos²(θ) - 1, rearranging gives 2cos²(θ) = 1 + cos(2θ), therefore (1 + cos(2θ)) / 2 = cos²(θ).'
    }),

    // 34. Ratio reduction: sin(2θ) / (1 + cos(2θ))
    () => ({
      q: 'Simplify the expression: sin(2θ) / (1 + cos(2θ)):',
      correct: 'tan(θ)',
      w1: 'cot(θ)',
      w2: 'sin(θ)',
      w3: '2 tan(θ)',
      exp: 'sin(2θ) = 2sin(θ)cos(θ) and 1 + cos(2θ) = 2cos²(θ). Then 2sin(θ)cos(θ) / (2cos²(θ)) = sin(θ)/cos(θ) = tan(θ).'
    }),

    // 35. Numerical Problem: sin(2θ) given tan(θ) = 1/2
    () => ({
      q: 'If tan(θ) = 1/2, compute the value of sin(2θ):',
      correct: '4 / 5',
      w1: '3 / 5',
      w2: '2 / 5',
      w3: '1',
      exp: 'Using sin(2θ) = (2 tan θ) / (1 + tan² θ): sin(2θ) = (2 × 1/2) / (1 + (1/2)²) = 1 / (1 + 1/4) = 1 / (5/4) = 4/5.'
    }),

    // 36. Numerical Problem: tan(2θ) given tan(θ) = 1/3
    () => ({
      q: 'If tan(θ) = 1/3, evaluate tan(2θ):',
      correct: '3 / 4',
      w1: '2 / 3',
      w2: '1 / 2',
      w3: '4 / 3',
      exp: 'Using tan(2θ) = (2 tan θ) / (1 - tan² θ): tan(2θ) = (2 × 1/3) / (1 - (1/3)²) = (2/3) / (1 - 1/9) = (2/3) / (8/9) = (2/3) × (9/8) = 3/4.'
    })
  ];

  for (let i = 0; i < neededCount; i++) {
    const gen = generators[i % generators.length];
    const data = gen();
    const targetLetter = optionLetters[i % 4];

    let optA = '', optB = '', optC = '', optD = '';
    if (targetLetter === 'a') {
      optA = data.correct; optB = data.w1; optC = data.w2; optD = data.w3;
    } else if (targetLetter === 'b') {
      optA = data.w1; optB = data.correct; optC = data.w2; optD = data.w3;
    } else if (targetLetter === 'c') {
      optA = data.w1; optB = data.w2; optC = data.correct; optD = data.w3;
    } else {
      optA = data.w1; optB = data.w2; optC = data.w3; optD = data.correct;
    }

    list.push({
      question: data.q,
      option_a: optA,
      option_b: optB,
      option_c: optC,
      option_d: optD,
      correct_option: targetLetter,
      subject: subjectName || 'Mathematics',
      difficulty,
      explanation: `${data.exp} (Option ${targetLetter.toUpperCase()} is the exact mathematically verified answer).`,
    });
  }

  return list;
}

/**
 * Specialized procedural generator for Mathematics topics (Calculus, Linear Algebra,
 * Probability, Geometry, Trigonometry, Discrete Math, Differential Equations).
 * Guarantees mathematically authentic problems with exact arithmetic, correct options,
 * and step-by-step mathematical working in explanations.
 */
function generateProceduralMathQuestions(
  prompt: string,
  neededCount: number,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  subjectName: string
): GeneratedQuestion[] {
  const list: GeneratedQuestion[] = [];
  const optionLetters: ('a' | 'b' | 'c' | 'd')[] = ['a', 'b', 'c', 'd'];

  const generators = [
    // 1. Definite Integral of Polynomial
    (idx: number) => {
      const a = ((idx % 3) + 1) * 2; // 2, 4, 6
      const b = (idx % 4) + 1;       // 1, 2, 3, 4
      const upper = (idx % 3) + 2;   // 2, 3, 4
      const lower = 0;
      const val = (a / 2) * (upper * upper) + b * upper;
      const q = `Evaluate the definite integral: I = ∫[${lower} to ${upper}] (${a}x + ${b}) dx:`;
      const correct = `${val}`;
      const w1 = `${val + upper}`;
      const w2 = `${val - (a / 2)}`;
      const w3 = `${val * 2}`;
      const exp = `Integrating: ∫ (${a}x + ${b}) dx = [ (${a}/2)x² + ${b}x ] = [ ${a / 2}x² + ${b}x ] evaluated from 0 to ${upper} = (${a / 2} × ${upper}² + ${b} × ${upper}) - 0 = (${(a / 2) * upper * upper} + ${b * upper}) = ${val}.`;
      return { q, correct, w1, w2, w3, exp };
    },

    // 2. 2x2 Matrix Determinant
    (idx: number) => {
      const a = (idx % 5) + 2;
      const b = (idx % 4) + 1;
      const c = (idx % 3) + 1;
      const d = (idx % 6) + 3;
      const det = a * d - b * c;
      const q = `Compute the determinant of the 2×2 matrix M = [[${a}, ${b}], [${c}, ${d}]]:`;
      const correct = `${det}`;
      const w1 = `${det + 2}`;
      const w2 = `${a * d + b * c}`;
      const w3 = `${det - 4}`;
      const exp = `For a 2×2 matrix [[a, b], [c, d]], the determinant is given by det(M) = ad - bc = (${a})(${d}) - (${b})(${c}) = ${a * d} - ${b * c} = ${det}.`;
      return { q, correct, w1, w2, w3, exp };
    },

    // 3. Matrix Trace
    (idx: number) => {
      const a = (idx % 7) + 3;
      const b = (idx % 4) - 2;
      const c = (idx % 5) + 1;
      const d = (idx % 6) + 4;
      const trace = a + d;
      const q = `Find the trace Tr(M) of the matrix M = [[${a}, ${b}], [${c}, ${d}]]:`;
      const correct = `${trace}`;
      const w1 = `${trace + 3}`;
      const w2 = `${a * d - b * c}`;
      const w3 = `${trace - 2}`;
      const exp = `The trace of a square matrix is the sum of its main diagonal entries: Tr(M) = a11 + a22 = ${a} + ${d} = ${trace}.`;
      return { q, correct, w1, w2, w3, exp };
    },

    // 4. Limit lim x->0 sin(kx)/mx
    (idx: number) => {
      const k = (idx % 5) + 2;
      const m = (idx % 4) + 1;
      const q = `Evaluate the standard trigonometric limit: L = lim(x → 0) [ sin(${k}x) / (${m}x) ]:`;
      const correct = `${k} / ${m}`;
      const w1 = `${m} / ${k}`;
      const w2 = `0`;
      const w3 = `1`;
      const exp = `Using the fundamental limit lim(u → 0) [sin(u)/u] = 1, we rewrite: lim(x → 0) [ (${k}/${m}) × (sin(${k}x)/(${k}x)) ] = (${k}/${m}) × 1 = ${k}/${m}.`;
      return { q, correct, w1, w2, w3, exp };
    },

    // 5. Derivative evaluation at x = 1
    (idx: number) => {
      const a = (idx % 3) + 2;
      const b = (idx % 4) + 1;
      const c = (idx % 5) + 3;
      const val = 3 * a - 2 * b + c;
      const q = `Find the value of the first derivative f'(1) for the polynomial f(x) = ${a}x³ - ${b}x² + ${c}x - 7:`;
      const correct = `${val}`;
      const w1 = `${val + 2}`;
      const w2 = `${val - 3}`;
      const w3 = `${a - b + c}`;
      const exp = `Differentiating f(x) with respect to x: f'(x) = 3(${a})x² - 2(${b})x + ${c} = ${3 * a}x² - ${2 * b}x + ${c}. Substituting x = 1 yields: f'(1) = ${3 * a}(1)² - ${2 * b}(1) + ${c} = ${3 * a} - ${2 * b} + ${c} = ${val}.`;
      return { q, correct, w1, w2, w3, exp };
    },

    // 6. Quadratic Discriminant
    (idx: number) => {
      const a = 1;
      const b = (idx % 4) * 2 + 6; // 6, 8, 10, 12
      const c = (idx % 5) + 2;     // 2, 3, 4, 5, 6
      const delta = b * b - 4 * a * c;
      const q = `What is the discriminant Δ of the quadratic equation x² - ${b}x + ${c} = 0?`;
      const correct = `${delta} (Roots are real and distinct)`;
      const w1 = `${delta - 8} (Roots are imaginary)`;
      const w2 = `${b * b + 4 * a * c} (Roots are equal)`;
      const w3 = `0 (Roots are real and equal)`;
      const exp = `For ax² + bx + c = 0, discriminant Δ = b² - 4ac. Here a = 1, b = -${b}, c = ${c}. Δ = (-${b})² - 4(1)(${c}) = ${b * b} - ${4 * c} = ${delta}. Since Δ > 0, the equation has two distinct real roots.`;
      return { q, correct, w1, w2, w3, exp };
    },

    // 7. Arithmetic Progression (AP) nth term
    (idx: number) => {
      const a = (idx % 5) + 3;
      const d = (idx % 4) + 2;
      const n = (idx % 6) + 10;
      const tn = a + (n - 1) * d;
      const q = `In an Arithmetic Progression with first term a = ${a} and common difference d = ${d}, find the ${n}th term (T_${n}):`;
      const correct = `${tn}`;
      const w1 = `${tn + d}`;
      const w2 = `${tn - d}`;
      const w3 = `${a * n}`;
      const exp = `The general formula for the nth term of an AP is T_n = a + (n - 1)d. Here a = ${a}, d = ${d}, n = ${n}. Therefore T_${n} = ${a} + (${n} - 1)(${d}) = ${a} + (${n - 1} × ${d}) = ${a} + ${(n - 1) * d} = ${tn}.`;
      return { q, correct, w1, w2, w3, exp };
    },

    // 8. Vector Dot Product
    (idx: number) => {
      const u1 = (idx % 4) + 1;
      const u2 = (idx % 3) + 2;
      const v1 = (idx % 5) - 2;
      const v2 = (idx % 4) + 3;
      const dot = u1 * v1 + u2 * v2;
      const q = `Given vectors u = ${u1}i + ${u2}j and v = ${v1}i + ${v2}j, calculate their scalar dot product u · v:`;
      const correct = `${dot}`;
      const w1 = `${dot + 4}`;
      const w2 = `${dot - 3}`;
      const w3 = `${u1 * v2 - u2 * v1}`;
      const exp = `The dot product of two 2D vectors is u · v = (u1 × v1) + (u2 × v2) = (${u1} × ${v1}) + (${u2} × ${v2}) = ${u1 * v1} + ${u2 * v2} = ${dot}.`;
      return { q, correct, w1, w2, w3, exp };
    },

    // 9. Probability with Urn
    (idx: number) => {
      const red = (idx % 4) + 3;
      const blue = (idx % 5) + 4;
      const total = red + blue;
      const q = `An urn contains ${red} red balls and ${blue} blue balls. If one ball is drawn uniformly at random, what is the probability that it is red?`;
      const correct = `${red} / ${total}`;
      const w1 = `${blue} / ${total}`;
      const w2 = `1 / ${red}`;
      const w3 = `${red} / ${blue}`;
      const exp = `Probability P(Red) = Number of favorable outcomes / Total possible outcomes = ${red} / (${red} + ${blue}) = ${red} / ${total}.`;
      return { q, correct, w1, w2, w3, exp };
    },

    // 10. Combinations C(n, 2)
    (idx: number) => {
      const n = (idx % 6) + 6; // 6 to 11
      const c = (n * (n - 1)) / 2;
      const q = `How many distinct unordered pairs (combinations of 2 items) can be selected from a set of ${n} elements?`;
      const correct = `${c}`;
      const w1 = `${c + n}`;
      const w2 = `${n * (n - 1)}`;
      const w3 = `${c - 4}`;
      const exp = `The number of ways to choose 2 items from n items is C(n, 2) = n(n - 1) / 2! = (${n} × ${n - 1}) / 2 = ${n * (n - 1)} / 2 = ${c}.`;
      return { q, correct, w1, w2, w3, exp };
    },

    // 11. Complex Number Modulus
    (idx: number) => {
      const triplets = [
        { a: 3, b: 4, mod: 5 },
        { a: 6, b: 8, mod: 10 },
        { a: 5, b: 12, mod: 13 },
        { a: 8, b: 15, mod: 17 },
        { a: 7, b: 24, mod: 25 },
      ];
      const trip = triplets[idx % triplets.length];
      const q = `What is the modulus |z| of the complex number z = ${trip.a} + ${trip.b}i?`;
      const correct = `${trip.mod}`;
      const w1 = `${trip.a + trip.b}`;
      const w2 = `${trip.mod + 2}`;
      const w3 = `${trip.a * trip.b}`;
      const exp = `For a complex number z = x + yi, the modulus is |z| = √(x² + y²) = √(${trip.a}² + ${trip.b}²) = √(${trip.a * trip.a} + ${trip.b * trip.b}) = √${trip.mod * trip.mod} = ${trip.mod}.`;
      return { q, correct, w1, w2, w3, exp };
    },

    // 12. Logarithm Evaluation
    (idx: number) => {
      const bases = [2, 3, 5, 10];
      const base = bases[idx % bases.length];
      const p = (idx % 3) + 2; // 2, 3, 4
      const val = Math.pow(base, p);
      const q = `Evaluate the logarithmic expression: log_${base}(${val}):`;
      const correct = `${p}`;
      const w1 = `${p + 1}`;
      const w2 = `${val / base}`;
      const w3 = `${base}`;
      const exp = `By definition of logarithms, log_b(b^k) = k. Here ${val} = ${base}^${p}, therefore log_${base}(${val}) = log_${base}(${base}^${p}) = ${p}.`;
      return { q, correct, w1, w2, w3, exp };
    }
  ];

  for (let i = 0; i < neededCount; i++) {
    const gen = generators[i % generators.length];
    const data = gen(i);
    const targetLetter = optionLetters[i % 4];

    let optA = '', optB = '', optC = '', optD = '';
    if (targetLetter === 'a') {
      optA = data.correct; optB = data.w1; optC = data.w2; optD = data.w3;
    } else if (targetLetter === 'b') {
      optA = data.w1; optB = data.correct; optC = data.w2; optD = data.w3;
    } else if (targetLetter === 'c') {
      optA = data.w1; optB = data.w2; optC = data.correct; optD = data.w3;
    } else {
      optA = data.w1; optB = data.w2; optC = data.w3; optD = data.correct;
    }

    list.push({
      question: data.q,
      option_a: optA,
      option_b: optB,
      option_c: optC,
      option_d: optD,
      correct_option: targetLetter,
      subject: subjectName || 'Mathematics',
      difficulty,
      explanation: `${data.exp} (Option ${targetLetter.toUpperCase()} is the exact mathematically verified answer).`,
    });
  }

  return list;
}

/**
 * Intelligent Subject Question Generator
 * Uses AI Client (Gemini or Ollama) if configured; falls back to an extensive curriculum generator.
 */
export async function generateCurriculumQuestions(
  prompt: string,
  subject: string,
  count: number = 10,
  difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium',
  aiClient?: GoogleGenAI | null
): Promise<GeneratedQuestion[]> {
  const safeCount = Math.min(Math.max(count || 10, 1), 50);
  const subjectLower = (subject || '').toLowerCase().trim();
  const promptLower = (prompt || '').toLowerCase().trim();
  const fullText = `${subjectLower} ${promptLower}`;

  // Precise topic classification
  const isTrigonometry = /trig|compound|multiple angle|sin2|sin 2|sin3|sin 3|sin\(|cos\(|tan\(|thetha|theta|angle|identity|identities|sin²|cos²|tan²|sec²|cosec|cot/i.test(fullText);
  const isCalculus = /calculus|derivative|integral|limit|continuity|differential equation|maxima|minima/i.test(fullText);
  const isLinearAlgebra = /matrix|matrices|determinant|eigen|trace|rank|vector/i.test(fullText);
  const isProbability = /probability|distribution|bayes|variance|binomial|poisson/i.test(fullText);
  const isMath = isTrigonometry || isCalculus || isLinearAlgebra || isProbability || /math|algebra|arithmetic|geometry/i.test(fullText);

  // 1. Try Gemini AI generation if client is available
  if (aiClient) {
    try {
      const mathGuidance = isMath
        ? `\nSPECIAL MATHEMATICAL INSTRUCTIONS:
- You are writing mathematically rigorous questions for ${subject || 'Mathematics'}.
- Use clean readable Unicode notation: √, ², ³, π, θ, λ, ∫, ∑, ≤, ≥, ±, ≠, ÷, · instead of unescaped LaTeX backslashes that crash JSON parsing.
- All 4 options must be distinct, plausible mathematical quantities or symbolic expressions.
- The "explanation" field MUST include step-by-step mathematical working: Formula -> Value Substitution -> Simplification -> Final Verified Result.`
        : '';

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are an expert national examination author and university professor setting questions for competitive examinations (including GATE, JEE Main & Advanced, NEET, CAT, GRE, UPSC, or technical university curricula).
Subject/Curriculum: "${subject}".
Syllabus / Topic Focus: "${prompt}".
Target Difficulty: ${difficulty}.
Target Question Count: ${safeCount}.${mathGuidance}

Generate exactly ${safeCount} high-quality multiple-choice questions aligned with standard competitive examination patterns.
- For GATE (CS/IT, ECE, Mechanical): Include formal theorems, computational complexity, memory structures, circuit analysis, automata.
- For JEE / Mathematics: Include calculus (integrals, limits, ODEs), linear algebra (matrices, eigenvalues, trace), coordinate geometry, probability, trigonometry (compound angles, double angles sin 2θ, cos 2θ, tan 2θ, triple angles sin 3θ, cos 3θ, sin(A+B), etc.).
- For NEET: Include genetics, molecular biology, human organ physiology, botanical mechanisms.
- For CAT / GMAT / Aptitude: Include time-speed-distance, percentage calculations, algebra, geometric reasoning.
- For UPSC / General Studies: Include Indian constitutional articles, macroeconomics, environmental agreements, governance policies.

Include precise step-by-step reasoning in the "explanation" property.

Schema requirements:
Return ONLY a valid JSON array of objects with the exact schema:
[
  {
    "question": "Clear and detailed question text",
    "option_a": "First distinct answer option",
    "option_b": "Second distinct answer option",
    "option_c": "Third distinct answer option",
    "option_d": "Fourth distinct answer option",
    "correct_option": "a",
    "explanation": "Thorough step-by-step mathematical explanation of why the correct option is right"
  }
]
Important: Distribute correct options ('a', 'b', 'c', 'd') evenly across the questions. Ensure each question tests a different sub-concept.`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      });

      const text = response.text || '[]';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, safeCount).map(item => ({
          question: item.question || item.q,
          option_a: item.option_a || item.a,
          option_b: item.option_b || item.b,
          option_c: item.option_c || item.c,
          option_d: item.option_d || item.d,
          correct_option: (item.correct_option || item.correct || 'a').toLowerCase() as 'a' | 'b' | 'c' | 'd',
          subject: subject || (isMath ? 'Mathematics' : 'General'),
          difficulty,
          explanation: item.explanation || `Correct answer is Option ${(item.correct_option || 'A').toUpperCase()}`,
        }));
      }
    } catch (err) {
      console.warn('AI engine question generation fallback:', err);
    }
  }

  // 2. High-Speed Curriculum & Procedural Generator (Offline/Fallback)

  // 2a. If Trigonometry is specifically requested or detected in prompt/subject
  if (isTrigonometry) {
    return generateProceduralTrigonometryQuestions(
      prompt,
      safeCount,
      difficulty,
      subject || 'Mathematics'
    );
  }

  // 2b. If other Mathematics subtopics are requested
  if (isMath) {
    return generateProceduralMathQuestions(
      prompt,
      safeCount,
      difficulty,
      subject || 'Mathematics'
    );
  }

  // 2c. Non-mathematical subjects: Select normalized subject from curriculum bank
  const result: GeneratedQuestion[] = [];
  
  const normalizedSubject = Object.keys(CURRICULUM_BANK).find(k => {
    const kl = k.toLowerCase();
    // Prevent non-math subject matching physics erroneously if user did not ask for physics
    if (kl.includes('physics') && !subjectLower.includes('physics') && !promptLower.includes('physics')) {
      return false;
    }
    return (
      kl === subjectLower ||
      subjectLower.includes(kl) ||
      kl.includes(subjectLower) ||
      promptLower.includes(kl) ||
      (kl.includes('gate') && (subjectLower.includes('gate') || promptLower.includes('gate'))) ||
      (kl.includes('jee') && (subjectLower.includes('jee') || promptLower.includes('jee'))) ||
      (kl.includes('neet') && (subjectLower.includes('neet') || promptLower.includes('neet'))) ||
      (kl.includes('cat') && (subjectLower.includes('cat') || promptLower.includes('cat') || subjectLower.includes('aptitude') || promptLower.includes('aptitude'))) ||
      (kl.includes('upsc') && (subjectLower.includes('upsc') || promptLower.includes('upsc') || subjectLower.includes('polity') || promptLower.includes('polity'))) ||
      (kl.includes('algorithm') && (subjectLower.includes('dsa') || promptLower.includes('dsa'))) ||
      (kl.includes('cyber') && (subjectLower.includes('security') || promptLower.includes('security'))) ||
      (kl.includes('cloud') && (subjectLower.includes('devops') || promptLower.includes('devops')))
    );
  });

  const subjectPool = normalizedSubject ? CURRICULUM_BANK[normalizedSubject] : null;

  if (subjectPool && subjectPool.length > 0) {
    // If user provided prompt keywords, rank questions that match keywords first
    const keywords = promptLower.split(/[\s,]+/).filter(w => w.length > 3);
    const matchingQuestions = keywords.length > 0
      ? subjectPool.filter(q => keywords.some(kw => q.question.toLowerCase().includes(kw) || q.explanation.toLowerCase().includes(kw)))
      : [];

    const remainingQuestions = subjectPool.filter(q => !matchingQuestions.includes(q));
    const combined = [...matchingQuestions, ...remainingQuestions.sort(() => 0.5 - Math.random())];

    for (let i = 0; i < Math.min(safeCount, combined.length); i++) {
      result.push({
        ...combined[i],
        difficulty,
        subject: subject || combined[i].subject,
      });
    }
  }

  // If safeCount is already reached, return
  if (result.length >= safeCount) {
    return result.slice(0, safeCount);
  }

  // If this is a Mathematics query, satisfy remainder using procedural math questions
  if (isMath) {
    const remainingNeeded = safeCount - result.length;
    const proceduralMath = generateProceduralMathQuestions(
      prompt,
      remainingNeeded,
      difficulty,
      subject || 'Mathematics'
    );
    result.push(...proceduralMath);
    return result.slice(0, safeCount);
  }

  // Extract key concept terms from prompt and subject
  const promptWords = prompt.replace(/[^a-zA-Z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 3);
  const coreConcept = promptWords[0] || subject || 'Core Problem Analysis';
  const subConcept = promptWords[1] || 'State Execution';

  // Check if subject / prompt is a competitive exam domain
  const isCompetitive = /gate|jee|neet|cat|gmat|gre|upsc|physics|chemistry|math|calculus|biology|mechanics|genetics|aptitude/i.test(`${subject} ${prompt}`);

  // Procedural templates with randomized answer permutations
  const competitiveTemplates = [
    {
      q: (n: number) => `In competitive examinations for ${subject}, what fundamental governing theorem or conservation law underpins ${coreConcept}?`,
      a: `Invariant state preservation under energy/matter conservation constraints`,
      b: `Arbitrary non-deterministic energy amplification without boundary conditions`,
      c: `Violation of thermodynamic equilibrium at standard temperature and pressure`,
      d: `Independent variable cancellation without algebraic equivalence`,
      correct: 'a' as const,
      exp: `Fundamental physical and mathematical models require invariant boundary conservation laws across isolated states.`
    },
    {
      q: (n: number) => `When solving analytical problems in ${subject} regarding ${coreConcept}, what is the critical step to prevent common calculation pitfalls?`,
      a: `Verifying dimensional homogeneity, boundary conditions, and sign conventions`,
      b: `Ignoring units of measurement and approximating non-linear terms linearly`,
      c: `Assuming instantaneous zero-latency equilibrium without transient analysis`,
      d: `Omitting the constant of integration in indefinite integral expressions`,
      correct: 'a' as const,
      exp: `Competitive exam evaluations test dimensional consistency, boundary limits, and rigorous sign conventions.`
    },
    {
      q: (n: number) => `Which mathematical or conceptual condition is strictly necessary when optimizing performance for ${coreConcept} in ${subject}?`,
      a: `Evaluating stationary critical points where the first derivative equals zero and checking second-order Hessian curvature`,
      b: `Arbitrarily maximizing all independent parameters towards positive infinity`,
      c: `Eliminating the objective function before computing local extrema`,
      d: `Assuming linear proportionality across higher-order exponential regimes`,
      correct: 'a' as const,
      exp: `Optimization requires identifying first-order stationary points (f'(x) = 0) and confirming concavity/convexity via the second derivative.`
    },
    {
      q: (n: number) => `In high-level competitive question analysis for ${subject}, what does the rate-determining step govern in ${coreConcept}?`,
      a: `The overall reaction velocity or asymptotic computational throughput of the system`,
      b: `The initial cosmetic visual appearance of output charts`,
      c: `The storage medium format of input examination papers`,
      d: `The ambient room temperature of the testing laboratory`,
      correct: 'a' as const,
      exp: `The slowest step in a sequence acts as the bottleneck, fundamentally determining the overall kinetics or algorithmic throughput.`
    },
    {
      q: (n: number) => `In ${subject}, what distinguishing property separates an ideal theoretical model of ${coreConcept} from real-world empirical behavior?`,
      a: `Presence of non-conservative resistive forces, friction, or internal entropy generation`,
      b: `Complete absence of mathematical constants across coordinate axes`,
      c: `Inversion of gravitational acceleration vectors at high altitudes`,
      d: `Spontaneous reversal of chronological time direction during operations`,
      correct: 'a' as const,
      exp: `Real systems experience irreversible entropy generation, friction, or non-conservative losses compared to frictionless ideal models.`
    }
  ];

  const standardTemplates = [
    {
      q: (n: number) => `In ${subject}, which architectural design pattern is most effective for modularizing ${coreConcept}?`,
      a: `Decoupled Dependency Injection and Interface Abstraction`,
      b: `Monolithic global shared state with unconstrained read-writes`,
      c: `Tight coupling of presentation views directly to raw database storage`,
      d: `Unrestricted synchronous RPC chains with zero timeouts`,
      correct: 'a' as const,
      exp: `Interface abstraction and dependency injection allow independent testing, maintainability, and clean separation of concerns.`
    },
    {
      q: (n: number) => `When optimizing runtime throughput for ${coreConcept} under heavy concurrency, which approach is recommended?`,
      a: `Non-blocking asynchronous event loops with connection pooling and caching`,
      b: `Blocking synchronous I/O with unbounded OS thread spawning`,
      c: `Disabling connection timeouts and garbage collection completely`,
      d: `Serializing all client requests through a single atomic file lock`,
      correct: 'a' as const,
      exp: `Asynchronous event-driven I/O paired with connection pooling scales efficiently by minimizing OS context-switching overhead.`
    },
    {
      q: (n: number) => `What is the principal security risk when integrating user-supplied inputs into ${coreConcept}?`,
      a: `Injection attacks and unauthorized privilege escalation via unsanitized payloads`,
      b: `Automatic cryptographic signing of outbound responses`,
      c: `Enforcing strict Content Security Policies (CSP)`,
      d: `Applying zero-trust role-based access control (RBAC)`,
      correct: 'a' as const,
      exp: `Failing to validate or parameterize incoming payloads allows attackers to inject malicious commands or bypass authorization boundaries.`
    },
    {
      q: (n: number) => `When analyzing computational complexity for ${coreConcept}, what does Big-O notation characterize?`,
      a: `The asymptotic upper bound on runtime growth or memory usage as input size scales towards infinity`,
      b: `The exact clock cycle duration required by a specific CPU hardware architecture`,
      c: `The total monetary cost of running cloud virtual machines per hour`,
      d: `The physical number of compilation passes required by the compiler`,
      correct: 'a' as const,
      exp: `Big-O notation describes asymptotic scalability independently of machine hardware specifications.`
    },
    {
      q: (n: number) => `Which data structure provides constant-time average lookup O(1) for managing elements in ${coreConcept}?`,
      a: `Hash Table (Hash Map) with an effective hash distribution function`,
      b: `Singly Linked List without auxiliary index pointers`,
      c: `Unsorted Linear Array`,
      d: `Binary Search Tree degraded into a linear linked list`,
      correct: 'a' as const,
      exp: `Hash tables map keys to index buckets via a hash function, achieving average O(1) search, insertion, and deletion.`
    }
  ];

  const extendedTemplates = [
    {
      q: (n: number) => `In ${subject}, which architectural design pattern is most effective for modularizing ${coreConcept}?`,
      a: `Decoupled Dependency Injection and Interface Abstraction`,
      b: `Monolithic global shared state with unconstrained read-writes`,
      c: `Tight coupling of presentation views directly to raw database storage`,
      d: `Unrestricted synchronous RPC chains with zero timeouts`,
      correct: 'a' as const,
      exp: `Interface abstraction and dependency injection allow independent testing, maintainability, and clean separation of concerns.`
    },
    {
      q: (n: number) => `When optimizing runtime throughput for ${coreConcept} under heavy concurrency, which approach is recommended?`,
      a: `Blocking synchronous I/O with unbounded OS thread spawning`,
      b: `Non-blocking asynchronous event loops with connection pooling and caching`,
      c: `Disabling connection timeouts and garbage collection completely`,
      d: `Serializing all client requests through a single atomic file lock`,
      correct: 'b' as const,
      exp: `Asynchronous event-driven I/O paired with connection pooling scales efficiently by minimizing OS context-switching overhead.`
    },
    {
      q: (n: number) => `What is the principal security risk when integrating user-supplied inputs into ${coreConcept}?`,
      a: `Automatic cryptographic signing of outbound responses`,
      b: `Injection attacks and unauthorized privilege escalation via unsanitized payloads`,
      c: `Enforcing strict Content Security Policies (CSP)`,
      d: `Applying zero-trust role-based access control (RBAC)`,
      correct: 'b' as const,
      exp: `Failing to validate or parameterize incoming payloads allows attackers to inject malicious commands or bypass authorization boundaries.`
    },
    {
      q: (n: number) => `What is the primary trade-off highlighted by the CAP Theorem when designing distributed storage for ${coreConcept}?`,
      a: `A distributed data store can guarantee at most two of Consistency, Availability, and Partition Tolerance simultaneously`,
      b: `System latency is strictly independent of physical networking distance`,
      c: `Disk write throughput automatically doubles with every replicated read node`,
      d: `Fault tolerance is achievable without any message passing across network links`,
      correct: 'a' as const,
      exp: `The CAP Theorem establishes that under network partitioning, a system must choose between consistent data across nodes or high availability.`
    },
    {
      q: (n: number) => `In ${subject}, what is the main purpose of automated regression test suites during ${coreConcept} releases?`,
      a: `Verifying that new feature commits do not inadvertently break established functionality`,
      b: `Artificially inflating software build durations before deployment`,
      c: `Eliminating the necessity for code documentation and design reviews`,
      d: `Guaranteeing that code will execute with zero memory utilization`,
      correct: 'a' as const,
      exp: `Regression testing systematically guards against unintended regressions when refactoring or adding features.`
    },
    {
      q: (n: number) => `Which strategy provides the most resilient failover mechanism for high-availability ${coreConcept} services?`,
      a: `Multi-region active-passive clustering with automated health-check DNS failover`,
      b: `Single point of failure deployment on a single bare-metal server`,
      c: `Manual DNS record modifications performed after complete service outages`,
      d: `Ignoring heartbeat signals to conserve server energy`,
      correct: 'a' as const,
      exp: `Automated health probes coupled with regional failover ensure continuous uptime without manual operator intervention.`
    },
    {
      q: (n: number) => `When analyzing computational complexity for ${coreConcept}, what does Big-O notation characterize?`,
      a: `The asymptotic upper bound on runtime growth or memory usage as input size scales towards infinity`,
      b: `The exact clock cycle duration required by a specific CPU hardware architecture`,
      c: `The total monetary cost of running cloud virtual machines per hour`,
      d: `The physical number of compilation passes required by the compiler`,
      correct: 'a' as const,
      exp: `Big-O notation describes asymptotic scalability independently of machine hardware specifications.`
    },
    {
      q: (n: number) => `Which data structure provides constant-time average lookup O(1) for managing elements in ${coreConcept}?`,
      a: `Hash Table (Hash Map) with an effective hash distribution function`,
      b: `Singly Linked List without auxiliary index pointers`,
      c: `Unsorted Linear Array`,
      d: `Binary Search Tree degraded into a linear linked list`,
      correct: 'a' as const,
      exp: `Hash tables map keys to index buckets via a hash function, achieving average O(1) search, insertion, and deletion.`
    },
    {
      q: (n: number) => `What is the significance of idempotency in RESTful APIs and distributed workflows handling ${coreConcept}?`,
      a: `Making multiple identical requests produces the same server state as making a single request`,
      b: `Ensuring that server responses are never cached by intermediate reverse proxies`,
      c: `Requiring every client call to increment a persistent database counter unconditionally`,
      d: `Converting all JSON payloads into raw XML streams before parsing`,
      correct: 'a' as const,
      exp: `Idempotency ensures that network retries and duplicate transmissions can be safely processed without unwanted side effects.`
    },
    {
      q: (n: number) => `How does database indexing accelerate query execution in ${coreConcept} workloads?`,
      a: `By maintaining auxiliary search trees (e.g. B-Trees) that allow logarithmic lookups without full table scans`,
      b: `By compressing table rows into encrypted archive files on disk`,
      c: `By executing queries directly in client browser memory`,
      d: `By deleting duplicate database records automatically during read operations`,
      correct: 'a' as const,
      exp: `Indexes create efficient lookup structures like B-Trees, transforming slow O(N) sequential table scans into O(log N) operations.`
    },
    {
      q: (n: number) => `What is the primary benefit of containerization (e.g. Docker) when deploying ${coreConcept} modules?`,
      a: `Package code with all runtime dependencies into uniform, reproducible, portable environments`,
      b: `Eliminating the need to write unit tests or monitor production logs`,
      c: `Providing unlimited physical CPU cores to arbitrary guest programs`,
      d: `Replacing database storage with ephemeral in-memory variables`,
      correct: 'a' as const,
      exp: `Containers package the runtime, libraries, and binaries together, ensuring consistent execution across development, staging, and production.`
    },
    {
      q: (n: number) => `In software testing for ${coreConcept}, what differentiates integration tests from unit tests?`,
      a: `Integration tests verify collaboration between multiple interacting subsystems, while unit tests isolate single components`,
      b: `Unit tests test the full end-to-end user browser experience, while integration tests do not execute code`,
      c: `Integration tests can only be written in Python, while unit tests require C++`,
      d: `Unit tests require live third-party payment gateways and remote cloud databases`,
      correct: 'a' as const,
      exp: `Unit tests isolate discrete functions or classes, whereas integration tests validate communication and contracts between multiple modules.`
    },
    {
      q: (n: number) => `Which cryptographic mechanism guarantees data integrity and authenticity in message exchanges for ${coreConcept}?`,
      a: `HMAC (Hash-based Message Authentication Code) or Digital Signatures`,
      b: `Base64 string encoding without a secret key`,
      c: `Caesar cipher rotation with a fixed shift offset`,
      d: `Simple XOR obfuscation with a public constant`,
      correct: 'a' as const,
      exp: `HMAC combines cryptographic hash functions with a shared secret key, verifying that payloads were not altered in transit.`
    },
    {
      q: (n: number) => `What is the key advantage of microservices compared to monolithic architecture for large-scale ${coreConcept}?`,
      a: `Independent deployment, horizontal scaling per domain boundary, and team autonomy`,
      b: `Guaranteed zero network communication latency between services`,
      c: `Total elimination of distributed tracing and logging requirements`,
      d: `Sharing a single global database without schemas across all company teams`,
      correct: 'a' as const,
      exp: `Microservices allow specialized domain services to scale and deploy independently according to operational demand.`
    },
    {
      q: (n: number) => `When profiling a memory leak in ${coreConcept}, which artifact provides the most direct evidence?`,
      a: `A comparative Heap Snapshot showing retained memory allocations that survive garbage collection`,
      b: `The number of open browser tabs on a developer machine`,
      c: `The total word count of the git commit message`,
      d: `The physical resolution of the monitor used during development`,
      correct: 'a' as const,
      exp: `Heap snapshots analyze retained object graphs and identify references preventing memory from being collected.`
    },
    {
      q: (n: number) => `What role does a Reverse Proxy (e.g. Nginx, Envoy) play in serving traffic for ${coreConcept}?`,
      a: `Load balancing, SSL/TLS termination, request routing, and caching static assets`,
      b: `Compiling TypeScript source files into native machine binaries`,
      c: `Directly executing database transactions without an application backend`,
      d: `Managing user browser cookies without HTTP headers`,
      correct: 'a' as const,
      exp: `Reverse proxies act as intermediaries, shielding backend servers and handling TLS, load distribution, and compression.`
    },
    {
      q: (n: number) => `In asynchronous programming for ${coreConcept}, what is a Deadlock condition?`,
      a: `A state where two or more threads/processes are permanently blocked waiting for resources held by each other`,
      b: `A routine executing faster than the CPU clock cycle`,
      c: `An HTTP request completing successfully with status code 200 OK`,
      d: `A background worker completing all queued jobs ahead of schedule`,
      correct: 'a' as const,
      exp: `Deadlocks occur when processes acquire locks and wait indefinitely for cyclic dependencies held by other blocked processes.`
    },
    {
      q: (n: number) => `What is the primary purpose of CI/CD pipelines when managing ${coreConcept} codebases?`,
      a: `Automating code linting, test suites, container builds, and deployment verification on every push`,
      b: `Preventing developers from writing comments in source code`,
      c: `Randomly restarting production servers during business peak hours`,
      d: `Replacing version control systems with email attachments`,
      correct: 'a' as const,
      exp: `Continuous Integration and Continuous Deployment ensure automated quality gates and predictable, repeatable releases.`
    },
    {
      q: (n: number) => `Which technique prevents Race Conditions when multiple worker threads modify shared state in ${coreConcept}?`,
      a: `Mutual Exclusion primitives (Mutexes), Semaphores, or atomic compare-and-swap operations`,
      b: `Removing all synchronization and allowing simultaneous memory writes`,
      c: `Increasing thread count to maximum hardware capacity without barriers`,
      d: `Relying on sleep timeouts rather than synchronization locks`,
      correct: 'a' as const,
      exp: `Mutexes and atomic primitives ensure that only one thread can execute a critical section at any given time, preventing race conditions.`
    },
    {
      q: (n: number) => `In software design for ${coreConcept}, what does the Principle of Least Privilege mandate?`,
      a: `Accounts, modules, and processes must only be granted the minimum necessary permissions required to perform their task`,
      b: `All network ports and administrative routes must remain permanently open to the public internet`,
      c: `Developers should write as few unit tests as possible`,
      d: `Every microservice must possess full root/superuser database privileges`,
      correct: 'a' as const,
      exp: `The Principle of Least Privilege limits the blast radius of potential security compromises by strictly restricting access rights.`
    }
  ];

  const proceduralTemplates = isCompetitive
    ? [...competitiveTemplates, ...extendedTemplates, ...standardTemplates]
    : [...standardTemplates, ...extendedTemplates, ...competitiveTemplates];

  // Helper to rotate options so correct answer is distributed across a, b, c, d
  const optionLetters: ('a' | 'b' | 'c' | 'd')[] = ['a', 'b', 'c', 'd'];

  let templateIdx = 0;
  while (result.length < safeCount) {
    const t = proceduralTemplates[templateIdx % proceduralTemplates.length];
    const targetCorrectLetter = optionLetters[result.length % 4];

    // Build options with target correct answer at targetCorrectLetter
    const optionsRaw = [
      { text: t.a, isCorrect: true },
      { text: t.b, isCorrect: false },
      { text: t.c, isCorrect: false },
      { text: t.d, isCorrect: false },
    ];

    // Rearrange so the correct one lands on targetCorrectLetter
    const correctObj = optionsRaw[0];
    const wrongObjs = [optionsRaw[1], optionsRaw[2], optionsRaw[3]];
    
    let optA = '', optB = '', optC = '', optD = '';
    if (targetCorrectLetter === 'a') {
      optA = correctObj.text;
      optB = wrongObjs[0].text;
      optC = wrongObjs[1].text;
      optD = wrongObjs[2].text;
    } else if (targetCorrectLetter === 'b') {
      optA = wrongObjs[0].text;
      optB = correctObj.text;
      optC = wrongObjs[1].text;
      optD = wrongObjs[2].text;
    } else if (targetCorrectLetter === 'c') {
      optA = wrongObjs[0].text;
      optB = wrongObjs[1].text;
      optC = correctObj.text;
      optD = wrongObjs[2].text;
    } else {
      optA = wrongObjs[0].text;
      optB = wrongObjs[1].text;
      optC = wrongObjs[2].text;
      optD = correctObj.text;
    }

    const questionNumberSuffix = templateIdx >= proceduralTemplates.length
      ? ` (Evaluation Dimension ${Math.floor(templateIdx / proceduralTemplates.length) + 1})`
      : '';

    result.push({
      question: `${t.q(templateIdx + 1)}${questionNumberSuffix}`,
      option_a: optA,
      option_b: optB,
      option_c: optC,
      option_d: optD,
      correct_option: targetCorrectLetter,
      subject: subject || 'General',
      difficulty,
      explanation: `${t.exp} (Option ${targetCorrectLetter.toUpperCase()} is the correct technical solution).`,
    });

    templateIdx++;
  }

  return result.slice(0, safeCount);
}
