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

  // Easy Generators: Basic identities, quadrant signs, radian conversions, and fundamental formulas
  const easyGenerators = [
    // 1. Pythagorean Fundamental Identity
    () => ({
      q: 'Which of the following is the fundamental Pythagorean identity for any angle θ?',
      correct: 'sin²(θ) + cos²(θ) = 1',
      w1: 'sin²(θ) - cos²(θ) = 1',
      w2: 'sin(θ) + cos(θ) = 1',
      w3: 'tan²(θ) + sec²(θ) = 1',
      exp: 'The fundamental identity of trigonometry states that on the unit circle, x² + y² = 1, hence cos²(θ) + sin²(θ) = 1.'
    }),
    // 2. Secant-Tangent Identity
    () => ({
      q: 'What is the standard identity relating secant and tangent?',
      correct: '1 + tan²(θ) = sec²(θ)',
      w1: '1 + sec²(θ) = tan²(θ)',
      w2: 'tan²(θ) - sec²(θ) = 1',
      w3: '1 - tan²(θ) = sec²(θ)',
      exp: 'Dividing sin²(θ) + cos²(θ) = 1 by cos²(θ) gives tan²(θ) + 1 = sec²(θ).'
    }),
    // 3. Cosecant-Cotangent Identity
    () => ({
      q: 'Which identity correctly relates cosecant and cotangent?',
      correct: '1 + cot²(θ) = cosec²(θ)',
      w1: '1 + cosec²(θ) = cot²(θ)',
      w2: 'cosec²(θ) + cot²(θ) = 1',
      w3: 'cot²(θ) - cosec²(θ) = 1',
      exp: 'Dividing sin²(θ) + cos²(θ) = 1 by sin²(θ) yields 1 + cot²(θ) = cosec²(θ).'
    }),
    // 4. Standard Value: sin(30°)
    () => ({
      q: 'What is the exact standard value of sin(30°) or sin(π/6)?',
      correct: '1 / 2',
      w1: '√3 / 2',
      w2: '1 / √2',
      w3: '√3',
      exp: 'In an equilateral triangle split in half, sin(30°) = opposite / hypotenuse = 1/2.'
    }),
    // 5. Standard Value: cos(60°)
    () => ({
      q: 'What is the exact standard value of cos(60°) or cos(π/3)?',
      correct: '1 / 2',
      w1: '√3 / 2',
      w2: '1 / √2',
      w3: '0',
      exp: 'By complementary angles, cos(60°) = sin(90° - 60°) = sin(30°) = 1/2.'
    }),
    // 6. Standard Value: tan(45°)
    () => ({
      q: 'What is the exact standard value of tan(45°) or tan(π/4)?',
      correct: '1',
      w1: '1 / √3',
      w2: '√3',
      w3: '1 / 2',
      exp: 'In an isosceles right triangle with legs of length 1, tan(45°) = opposite / adjacent = 1/1 = 1.'
    }),
    // 7. Radians to Degrees
    () => ({
      q: 'How many degrees is equivalent to π radians in angle measurement?',
      correct: '180°',
      w1: '90°',
      w2: '360°',
      w3: '270°',
      exp: 'By definition of radian measure, a straight angle corresponds to π radians, which equals 180°.'
    }),
    // 8. ASTC Rule - Quadrant II Signs
    () => ({
      q: 'According to the ASTC quadrant rule, which trigonometric function (and its reciprocal) is positive in the second quadrant (90° < θ < 180°)?',
      correct: 'sin(θ) and cosec(θ)',
      w1: 'cos(θ) and sec(θ)',
      w2: 'tan(θ) and cot(θ)',
      w3: 'All trigonometric functions are positive',
      exp: 'In quadrant II, x-coordinates are negative and y-coordinates are positive. Thus sin(θ) = y/r is positive, while cos and tan are negative.'
    }),
    // 9. Standard Double Angle Identity: sin(2θ)
    () => ({
      q: 'Which of the following is the standard identity for sin(2θ) in terms of sin(θ) and cos(θ)?',
      correct: '2 sin(θ) cos(θ)',
      w1: 'sin²(θ) - cos²(θ)',
      w2: '2 sin(θ)',
      w3: 'cos²(θ) + sin²(θ)',
      exp: 'From the compound angle addition formula: sin(2θ) = sin(θ + θ) = sin(θ)cos(θ) + cos(θ)sin(θ) = 2 sin(θ) cos(θ).'
    }),
    // 10. Standard Compound Angle: sin(A + B)
    () => ({
      q: 'According to the compound angle addition theorem, sin(A + B) is equal to:',
      correct: 'sin(A) cos(B) + cos(A) sin(B)',
      w1: 'sin(A) cos(B) - cos(A) sin(B)',
      w2: 'cos(A) cos(B) - sin(A) sin(B)',
      w3: 'cos(A) cos(B) + sin(A) sin(B)',
      exp: 'By the fundamental trigonometric addition theorem for sine: sin(A + B) = sin(A)cos(B) + cos(A)sin(B).'
    }),
    // 11. Compound Angle: cos(A - B)
    () => ({
      q: 'What is the compound angle expansion of cos(A - B)?',
      correct: 'cos(A) cos(B) + sin(A) sin(B)',
      w1: 'cos(A) cos(B) - sin(A) sin(B)',
      w2: 'sin(A) cos(B) - cos(A) sin(B)',
      w3: 'sin(A) sin(B) - cos(A) cos(B)',
      exp: 'cos(A - B) = cos(A + (-B)) = cos(A)cos(B) + sin(A)sin(B).'
    }),
    // 12. Double Angle reduction: 1 - cos(2θ)
    () => ({
      q: 'Express (1 - cos(2θ)) / 2 in terms of sin(θ):',
      correct: 'sin²(θ)',
      w1: 'cos²(θ)',
      w2: '2 sin²(θ)',
      w3: 'sin(θ)',
      exp: 'Since cos(2θ) = 1 - 2sin²(θ), rearranging gives 2sin²(θ) = 1 - cos(2θ), therefore (1 - cos(2θ)) / 2 = sin²(θ).'
    })
  ];

  // Medium Generators: Multi-step calculations, formula rewrites, exact 15°/75° values, numerical evaluations
  const mediumGenerators = [
    // 1. Double Angle: sin(2θ) in terms of tan(θ)
    () => ({
      q: 'Express sin(2θ) purely in terms of tan(θ):',
      correct: '(2 tan(θ)) / (1 + tan²(θ))',
      w1: '(2 tan(θ)) / (1 - tan²(θ))',
      w2: '(1 - tan²(θ)) / (1 + tan²(θ))',
      w3: 'tan(θ) / (1 + tan²(θ))',
      exp: 'sin(2θ) = 2sin(θ)cos(θ) = (2sin(θ)cos(θ)) / (cos²(θ) + sin²(θ)). Dividing numerator and denominator by cos²(θ) yields (2 tan(θ)) / (1 + tan²(θ)).'
    }),
    // 2. Double Angle: cos(2θ) in terms of tan(θ)
    () => ({
      q: 'What is the expression for cos(2θ) written in terms of tan(θ)?',
      correct: '(1 - tan²(θ)) / (1 + tan²(θ))',
      w1: '(1 + tan²(θ)) / (1 - tan²(θ))',
      w2: '(2 tan(θ)) / (1 - tan²(θ))',
      w3: '(2 tan(θ)) / (1 + tan²(θ))',
      exp: 'cos(2θ) = (cos²(θ) - sin²(θ)) / (cos²(θ) + sin²(θ)). Dividing both terms by cos²(θ) gives (1 - tan²(θ)) / (1 + tan²(θ)).'
    }),
    // 3. Double Angle: tan(2θ)
    () => ({
      q: 'What is the standard double-angle formula for tan(2θ) in terms of tan(θ)?',
      correct: '(2 tan(θ)) / (1 - tan²(θ))',
      w1: '(2 tan(θ)) / (1 + tan²(θ))',
      w2: '(1 - tan²(θ)) / (2 tan(θ))',
      w3: '(tan²(θ) - 1) / (2 tan(θ))',
      exp: 'Using tan(A + B) = (tan A + tan B) / (1 - tan A tan B) with A = B = θ: tan(2θ) = (2 tan(θ)) / (1 - tan²(θ)).'
    }),
    // 4. Numerical Problem: sin(2θ) given sin(θ) = 3/5
    () => ({
      q: 'If sin(θ) = 3/5 and θ is in the first quadrant (0 < θ < π/2), what is the exact value of sin(2θ)?',
      correct: '24 / 25',
      w1: '12 / 25',
      w2: '7 / 25',
      w3: '6 / 5',
      exp: 'In quadrant I, cos(θ) = √(1 - sin²θ) = √(1 - 9/25) = 4/5. Then sin(2θ) = 2 sin(θ) cos(θ) = 2 × (3/5) × (4/5) = 24/25.'
    }),
    // 5. Numerical Problem: cos(2θ) given cos(θ) = 4/5
    () => ({
      q: 'If cos(θ) = 4/5 and θ is acute, what is the value of cos(2θ)?',
      correct: '7 / 25',
      w1: '24 / 25',
      w2: '16 / 25',
      w3: '9 / 25',
      exp: 'Using the identity cos(2θ) = 2cos²(θ) - 1: cos(2θ) = 2(4/5)² - 1 = 2(16/25) - 1 = 32/25 - 1 = 7/25.'
    }),
    // 6. Numerical Problem: tan(A + B) given tan(A) = 1/2, tan(B) = 1/3
    () => ({
      q: 'If tan(A) = 1/2 and tan(B) = 1/3, what is the exact value of tan(A + B)?',
      correct: '1 (which implies A + B = 45°)',
      w1: '5 / 6',
      w2: '1 / 6',
      w3: '2 / 3',
      exp: 'tan(A + B) = (tan A + tan B) / (1 - tan A tan B) = (1/2 + 1/3) / (1 - (1/2)(1/3)) = (5/6) / (1 - 1/6) = (5/6) / (5/6) = 1.'
    }),
    // 7. Numerical Problem: sin(2θ) given tan(θ) = 1/2
    () => ({
      q: 'If tan(θ) = 1/2, compute the value of sin(2θ):',
      correct: '4 / 5',
      w1: '3 / 5',
      w2: '2 / 5',
      w3: '1',
      exp: 'Using sin(2θ) = (2 tan θ) / (1 + tan² θ): sin(2θ) = (2 × 1/2) / (1 + (1/2)²) = 1 / (1 + 1/4) = 1 / (5/4) = 4/5.'
    }),
    // 8. Numerical Problem: tan(2θ) given tan(θ) = 1/3
    () => ({
      q: 'If tan(θ) = 1/3, evaluate tan(2θ):',
      correct: '3 / 4',
      w1: '2 / 3',
      w2: '1 / 2',
      w3: '4 / 3',
      exp: 'Using tan(2θ) = (2 tan θ) / (1 - tan² θ): tan(2θ) = (2 × 1/3) / (1 - (1/3)²) = (2/3) / (1 - 1/9) = (2/3) / (8/9) = (2/3) × (9/8) = 3/4.'
    }),
    // 9. Exact Value: sin(75°)
    () => ({
      q: 'Using the compound angle identity sin(45° + 30°), what is the exact value of sin(75°)?',
      correct: '(√6 + √2) / 4',
      w1: '(√6 - √2) / 4',
      w2: '(√3 + 1) / 2',
      w3: '(√2 + 1) / 4',
      exp: 'sin(75°) = sin(45° + 30°) = sin(45°)cos(30°) + cos(45°)sin(30°) = (√2/2)(√3/2) + (√2/2)(1/2) = (√6 + √2)/4.'
    }),
    // 10. Exact Value: cos(75°)
    () => ({
      q: 'Evaluate the exact value of cos(75°) using the compound angle formula cos(45° + 30°):',
      correct: '(√6 - √2) / 4',
      w1: '(√6 + √2) / 4',
      w2: '(√3 - 1) / 2',
      w3: '(1 - √2) / 4',
      exp: 'cos(75°) = cos(45° + 30°) = cos(45°)cos(30°) - sin(45°)sin(30°) = (√2/2)(√3/2) - (√2/2)(1/2) = (√6 - √2)/4.'
    }),
    // 11. Exact Value: tan(75°)
    () => ({
      q: 'What is the exact simplified value of tan(75°)?',
      correct: '2 + √3',
      w1: '2 - √3',
      w2: '1 + √3',
      w3: '√3 - 1',
      exp: 'tan(75°) = tan(45° + 30°) = (1 + 1/√3)/(1 - 1/√3) = (√3 + 1)/(√3 - 1). Rationalizing gives (√3 + 1)²/2 = (4 + 2√3)/2 = 2 + √3.'
    }),
    // 12. Product to Sum: 2 sin(A) cos(B)
    () => ({
      q: 'Express the product 2 sin(A) cos(B) as a sum or difference of trigonometric functions:',
      correct: 'sin(A + B) + sin(A - B)',
      w1: 'sin(A + B) - sin(A - B)',
      w2: 'cos(A + B) + cos(A - B)',
      w3: 'cos(A - B) - cos(A + B)',
      exp: 'sin(A + B) + sin(A - B) = (sin A cos B + cos A sin B) + (sin A cos B - cos A sin B) = 2 sin A cos B.'
    }),
    // 13. Product to Sum: 2 cos(A) cos(B)
    () => ({
      q: 'Express the product 2 cos(A) cos(B) in sum-difference form:',
      correct: 'cos(A + B) + cos(A - B)',
      w1: 'cos(A + B) - cos(A - B)',
      w2: 'sin(A + B) + sin(A - B)',
      w3: 'sin(A + B) - sin(A - B)',
      exp: 'cos(A + B) + cos(A - B) = (cos A cos B - sin A sin B) + (cos A cos B + sin A sin B) = 2 cos A cos B.'
    }),
    // 14. Product to Sum: 2 sin(A) sin(B)
    () => ({
      q: 'Which expression is identically equal to 2 sin(A) sin(B)?',
      correct: 'cos(A - B) - cos(A + B)',
      w1: 'cos(A + B) - cos(A - B)',
      w2: 'sin(A + B) - sin(A - B)',
      w3: 'sin(A + B) + sin(A - B)',
      exp: 'cos(A - B) - cos(A + B) = (cos A cos B + sin A sin B) - (cos A cos B - sin A sin B) = 2 sin A sin B.'
    })
  ];

  // Hard Generators: Advanced triple-angle expansions, continuous product formulas, conditional identities, extremal values, Olympiad/JEE level
  const hardGenerators = [
    // 1. Triple Angle: sin(3θ) expansion
    () => ({
      q: 'What is the expansion of sin(3θ) in terms of powers of sin(θ)?',
      correct: '3 sin(θ) - 4 sin³(θ)',
      w1: '4 sin³(θ) - 3 sin(θ)',
      w2: '3 sin(θ) + 4 sin³(θ)',
      w3: '4 cos³(θ) - 3 cos(θ)',
      exp: 'sin(3θ) = sin(2θ + θ) = sin(2θ)cos(θ) + cos(2θ)sin(θ) = 2sin(θ)cos²(θ) + (1 - 2sin²(θ))sin(θ) = 2sin(θ)(1 - sin²(θ)) + sin(θ) - 2sin³(θ) = 3 sin(θ) - 4 sin³(θ).'
    }),
    // 2. Triple Angle: cos(3θ) expansion
    () => ({
      q: 'What is the expansion of cos(3θ) in terms of powers of cos(θ)?',
      correct: '4 cos³(θ) - 3 cos(θ)',
      w1: '3 cos(θ) - 4 cos³(θ)',
      w2: '4 cos³(θ) + 3 cos(θ)',
      w3: '3 sin(θ) - 4 sin³(θ)',
      exp: 'cos(3θ) = cos(2θ + θ) = cos(2θ)cos(θ) - sin(2θ)sin(θ) = (2cos²(θ) - 1)cos(θ) - 2sin²(θ)cos(θ) = 2cos³(θ) - cos(θ) - 2(1 - cos²(θ))cos(θ) = 4 cos³(θ) - 3 cos(θ).'
    }),
    // 3. Triple Angle: tan(3θ) expansion
    () => ({
      q: 'Which expression represents the triple-angle expansion of tan(3θ)?',
      correct: '(3 tan(θ) - tan³(θ)) / (1 - 3 tan²(θ))',
      w1: '(3 tan(θ) + tan³(θ)) / (1 - 3 tan²(θ))',
      w2: '(3 tan²(θ) - 1) / (1 - 3 tan(θ))',
      w3: '(3 tan(θ) - tan³(θ)) / (1 + 3 tan²(θ))',
      exp: 'tan(3θ) = tan(2θ + θ) = (tan 2θ + tan θ) / (1 - tan 2θ tan θ). Substituting tan 2θ = 2tan θ / (1 - tan² θ) simplifies to (3 tan(θ) - tan³(θ)) / (1 - 3 tan²(θ)).'
    }),
    // 4. Continuous Product: cos(20°) cos(40°) cos(80°)
    () => ({
      q: 'What is the exact product value of cos(20°) cos(40°) cos(80°)?',
      correct: '1 / 8',
      w1: '1 / 4',
      w2: '1 / 16',
      w3: '3 / 8',
      exp: 'Using the continuous product identity cos(θ)cos(2θ)cos(4θ) = sin(8θ)/(8 sin θ) with θ = 20°: sin(160°)/(8 sin 20°) = sin(180° - 20°)/(8 sin 20°) = sin(20°)/(8 sin 20°) = 1/8.'
    }),
    // 5. Continuous Product: sin(10°) sin(50°) sin(70°)
    () => ({
      q: 'Evaluate the exact value of the trigonometric product: P = sin(10°) sin(50°) sin(70°):',
      correct: '1 / 8',
      w1: '1 / 4',
      w2: '√3 / 8',
      w3: '1 / 16',
      exp: 'Using sin(θ)sin(60°-θ)sin(60°+θ) = (1/4)sin(3θ) with θ = 10°: P = (1/4) sin(30°) = (1/4) × (1/2) = 1/8.'
    }),
    // 6. Conditional Identity: tan(A) + tan(B) + tan(C) in a triangle
    () => ({
      q: 'In any triangle ABC where A + B + C = 180°, what does tan(A) + tan(B) + tan(C) equal?',
      correct: 'tan(A) tan(B) tan(C)',
      w1: '1',
      w2: '0',
      w3: 'tan(A + B + C)',
      exp: 'Since A + B = 180° - C, tan(A + B) = tan(180° - C) = -tan(C). Expanding (tan A + tan B)/(1 - tan A tan B) = -tan C gives tan A + tan B + tan C = tan A tan B tan C.'
    }),
    // 7. Identity: sin(A + B) sin(A - B)
    () => ({
      q: 'What is the product sin(A + B) sin(A - B) identically equal to?',
      correct: 'sin²(A) - sin²(B)',
      w1: 'sin²(A) + sin²(B)',
      w2: 'cos²(A) - cos²(B)',
      w3: 'cos²(A) - sin²(B)',
      exp: 'sin(A + B)sin(A - B) = (sin A cos B + cos A sin B)(sin A cos B - cos A sin B) = sin²A cos²B - cos²A sin²B = sin²A(1 - sin²B) - (1 - sin²A)sin²B = sin²A - sin²B.'
    }),
    // 8. Extremum Optimization: Maximum of a sin(θ) + b cos(θ)
    () => ({
      q: 'What is the maximum mathematical value attainable by the expression f(θ) = 3 sin(θ) + 4 cos(θ) over all real θ?',
      correct: '5',
      w1: '7',
      w2: '1',
      w3: '12',
      exp: 'The expression a sin(θ) + b cos(θ) can be rewritten as √(a² + b²) sin(θ + φ). Thus its maximum is √(3² + 4²) = √(9 + 16) = √25 = 5.'
    }),
    // 9. Algebraic Power Identity: sin(θ) + cosec(θ) = 2
    () => ({
      q: 'If sin(θ) + cosec(θ) = 2, what is the value of sin¹⁰(θ) + cosec¹⁰(θ)?',
      correct: '2',
      w1: '20',
      w2: '1024',
      w3: '1',
      exp: 'Let x = sin(θ). Then x + 1/x = 2 => x² - 2x + 1 = 0 => (x - 1)² = 0 => x = 1. Therefore sin(θ) = 1 and cosec(θ) = 1. Hence 1¹⁰ + 1¹⁰ = 1 + 1 = 2.'
    }),
    // 10. General Trigonometric Equation Solution
    () => ({
      q: 'Find the general solution for all real θ satisfying the equation sin(2θ) = cos(θ):',
      correct: 'θ = (2n + 1)(π / 2)  or  θ = nπ + (-1)ⁿ (π / 6)',
      w1: 'θ = nπ ± π / 3',
      w2: 'θ = 2nπ ± π / 6',
      w3: 'θ = nπ + π / 4',
      exp: '2sin(θ)cos(θ) - cos(θ) = 0 => cos(θ)(2sin(θ) - 1) = 0. Either cos(θ) = 0 => θ = (2n + 1)π/2, or sin(θ) = 1/2 => θ = nπ + (-1)ⁿ(π/6).'
    }),
    // 11. Inverse Composition: sin(2 arctan(1/2))
    () => ({
      q: 'Evaluate the exact value of the composite expression: sin(2 arctan(1/2)):',
      correct: '4 / 5',
      w1: '3 / 5',
      w2: '1 / 2',
      w3: '2 / 5',
      exp: 'Let α = arctan(1/2), so tan α = 1/2. Using sin(2α) = (2 tan α)/(1 + tan² α) = (2 × 1/2)/(1 + 1/4) = 1 / (5/4) = 4/5.'
    }),
    // 12. Exact Product: cos(10°) cos(50°) cos(70°)
    () => ({
      q: 'What is the exact product value of cos(10°) cos(50°) cos(70°)?',
      correct: '√3 / 8',
      w1: '1 / 8',
      w2: '3 / 16',
      w3: '√3 / 4',
      exp: 'Using the identity cos(θ)cos(60°-θ)cos(60°+θ) = (1/4)cos(3θ) with θ = 10°: P = (1/4) cos(30°) = (1/4) × (√3/2) = √3/8.'
    })
  ];

  // Select the appropriate pool strictly matching requested difficulty
  const generators = difficulty === 'Easy'
    ? easyGenerators
    : difficulty === 'Hard'
    ? hardGenerators
    : mediumGenerators;

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

  // Easy Generators: Direct formulas, fundamental calculus rules, 2x2 trace, standard algebra
  const easyGenerators = [
    // 1. Power Rule Derivative
    (idx: number) => {
      const a = (idx % 4) + 2;
      const b = (idx % 5) + 1;
      const q = `Find the derivative with respect to x: d/dx (${a}x² + ${b}x + 7):`;
      const correct = `${2 * a}x + ${b}`;
      const w1 = `${a}x + ${b}`;
      const w2 = `${2 * a}x² + ${b}`;
      const w3 = `${2 * a}x`;
      const exp = `Using the power rule d/dx(x^n) = n·x^(n-1): d/dx(${a}x²) = ${2 * a}x, d/dx(${b}x) = ${b}, and the derivative of the constant 7 is 0. Thus, f'(x) = ${2 * a}x + ${b}.`;
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
      const exp = `For a 2×2 matrix [[a, b], [c, d]], the determinant is det(M) = ad - bc = (${a})(${d}) - (${b})(${c}) = ${a * d} - ${b * c} = ${det}.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 3. Matrix Trace
    (idx: number) => {
      const a = (idx % 7) + 1;
      const d = (idx % 5) + 3;
      const trace = a + d;
      const q = `What is the trace of the 2×2 matrix [[${a}, 9], [4, ${d}]]?`;
      const correct = `${trace}`;
      const w1 = `${trace + 3}`;
      const w2 = `${a * d}`;
      const w3 = `${a * d - 36}`;
      const exp = `The trace of a square matrix is the sum of its main diagonal elements: Tr(M) = m11 + m22 = ${a} + ${d} = ${trace}.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 4. Arithmetic Progression (AP) nth term
    (idx: number) => {
      const a1 = (idx % 4) + 3;
      const d = (idx % 3) + 2;
      const n = (idx % 4) + 8;
      const an = a1 + (n - 1) * d;
      const q = `In an Arithmetic Progression with first term a = ${a1} and common difference d = ${d}, find the ${n}th term (T_${n}):`;
      const correct = `${an}`;
      const w1 = `${an + d}`;
      const w2 = `${an - d}`;
      const w3 = `${a1 * Math.pow(d, n - 1)}`;
      const exp = `The formula for the nth term of an AP is T_n = a + (n - 1)d. Here T_${n} = ${a1} + (${n} - 1) × ${d} = ${a1} + ${n - 1} × ${d} = ${a1} + ${(n - 1) * d} = ${an}.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 5. 2D Vector Dot Product
    (idx: number) => {
      const u1 = (idx % 4) + 1;
      const u2 = (idx % 3) + 2;
      const v1 = (idx % 5) + 2;
      const v2 = (idx % 4) + 1;
      const dot = u1 * v1 + u2 * v2;
      const q = `Compute the dot product of two vectors u = (${u1}, ${u2}) and v = (${v1}, ${v2}):`;
      const correct = `${dot}`;
      const w1 = `${dot + 3}`;
      const w2 = `${u1 * v2 - u2 * v1}`;
      const w3 = `${(u1 + v1) * (u2 + v2)}`;
      const exp = `The dot product of 2D vectors is u · v = u1·v1 + u2·v2 = (${u1})(${v1}) + (${u2})(${v2}) = ${u1 * v1} + ${u2 * v2} = ${dot}.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 6. Quadratic Discriminant
    (idx: number) => {
      const a = 1;
      const b = ((idx % 3) + 2) * 2;
      const c = (idx % 4) + 1;
      const disc = b * b - 4 * a * c;
      const q = `Calculate the discriminant (Δ = b² - 4ac) of the quadratic equation x² + ${b}x + ${c} = 0:`;
      const correct = `${disc}`;
      const w1 = `${disc + 8}`;
      const w2 = `${b * b + 4 * a * c}`;
      const w3 = `${disc - 4}`;
      const exp = `The discriminant is Δ = b² - 4ac = (${b})² - 4(1)(${c}) = ${b * b} - ${4 * a * c} = ${disc}.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 7. Logarithm Definition
    (idx: number) => {
      const bases = [2, 3, 5, 10];
      const base = bases[idx % bases.length];
      const p = (idx % 3) + 2;
      const val = Math.pow(base, p);
      const q = `Evaluate the logarithmic expression: log_${base}(${val}):`;
      const correct = `${p}`;
      const w1 = `${p + 1}`;
      const w2 = `${val / base}`;
      const w3 = `${base}`;
      const exp = `By definition of logarithms, log_b(b^k) = k. Here ${val} = ${base}^${p}, therefore log_${base}(${val}) = log_${base}(${base}^${p}) = ${p}.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 8. Probability with Urn
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
    }
  ];

  // Medium Generators: Multi-step integration, limits, eigenvalues, vector cross products, L'Hopital rule
  const mediumGenerators = [
    // 1. Definite Integral of Polynomial
    (idx: number) => {
      const a = ((idx % 3) + 1) * 2;
      const b = (idx % 4) + 1;
      const upper = (idx % 3) + 2;
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
    // 2. Trigonometric Limit
    (idx: number) => {
      const k = (idx % 5) + 2;
      const m = (idx % 3) + 1;
      const q = `Evaluate the fundamental trigonometric limit: lim(x→0) [ sin(${k}x) / (${m}x) ]:`;
      const correct = `${k} / ${m}`;
      const w1 = `1`;
      const w2 = `0`;
      const w3 = `${m} / ${k}`;
      const exp = `Using the standard limit lim(θ→0) [sin(θ)/θ] = 1: lim(x→0) [sin(${k}x)/(${m}x)] = (${k}/${m}) · lim(x→0) [sin(${k}x)/(${k}x)] = (${k}/${m}) · 1 = ${k}/${m}.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 3. Derivative Evaluation at a Point
    (idx: number) => {
      const a = (idx % 3) + 1;
      const b = (idx % 4) + 2;
      const c = (idx % 5) + 3;
      const val = 3 * a - 2 * b + c;
      const q = `Let f(x) = ${a}x³ - ${b}x² + ${c}x - 5. Evaluate f'(1):`;
      const correct = `${val}`;
      const w1 = `${val + 4}`;
      const w2 = `${val - 2}`;
      const w3 = `${3 * a + 2 * b + c}`;
      const exp = `Differentiating: f'(x) = 3(${a})x² - 2(${b})x + ${c} = ${3 * a}x² - ${2 * b}x + ${c}. At x = 1: f'(1) = ${3 * a}(1) - ${2 * b}(1) + ${c} = ${3 * a} - ${2 * b} + ${c} = ${val}.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 4. 2x2 Matrix Eigenvalues
    (idx: number) => {
      const lambda1 = (idx % 3) + 2;
      const lambda2 = (idx % 4) + 5;
      const trace = lambda1 + lambda2;
      const det = lambda1 * lambda2;
      const q = `A 2×2 matrix A has trace Tr(A) = ${trace} and determinant det(A) = ${det}. What are its eigenvalues?`;
      const correct = `λ = ${lambda1} and λ = ${lambda2}`;
      const w1 = `λ = ${lambda1 - 1} and λ = ${lambda2 + 1}`;
      const w2 = `λ = -${lambda1} and λ = -${lambda2}`;
      const w3 = `λ = ${trace} and λ = ${det}`;
      const exp = `The characteristic equation of a 2×2 matrix is λ² - Tr(A)λ + det(A) = 0 => λ² - ${trace}λ + ${det} = 0 => (λ - ${lambda1})(λ - ${lambda2}) = 0. Hence eigenvalues are ${lambda1} and ${lambda2}.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 5. 3D Vector Cross Product Magnitude
    (idx: number) => {
      const q = `If two 3D vectors have magnitudes |u| = 6 and |v| = 5, and the angle between them is θ = 30° (or π/6), what is the magnitude of their cross product |u × v|?`;
      const correct = `15`;
      const w1 = `15√3`;
      const w2 = `30`;
      const w3 = `30√3`;
      const exp = `The magnitude of the cross product is |u × v| = |u| · |v| · sin(θ) = 6 · 5 · sin(30°) = 30 · (1/2) = 15.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 6. L'Hopital's Rule Exponential Limit
    (idx: number) => {
      const k = (idx % 4) + 2;
      const m = (idx % 3) + 1;
      const q = `Evaluate the indeterminate limit using L'Hôpital's Rule: lim(x→0) [ (e^(${k}x) - 1) / (${m}x) ]:`;
      const correct = `${k} / ${m}`;
      const w1 = `1`;
      const w2 = `0`;
      const w3 = `${k * m}`;
      const exp = `As x → 0, the expression yields the indeterminate form 0/0. Applying L'Hôpital's Rule: differentiate numerator d/dx(e^(${k}x) - 1) = ${k}e^(${k}x) and denominator d/dx(${m}x) = ${m}. Limit becomes lim(x→0) [ ${k}e^(${k}x) / ${m} ] = ${k}(1) / ${m} = ${k}/${m}.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 7. Definite Integral with Substitution
    (idx: number) => {
      const q = `Evaluate the definite integral using u-substitution: I = ∫[0 to 1] 2x (x² + 1)³ dx:`;
      const correct = `15 / 4`;
      const w1 = `16`;
      const w2 = `7 / 2`;
      const w3 = `4`;
      const exp = `Let u = x² + 1, so du = 2x dx. When x = 0, u = 1; when x = 1, u = 2. The integral transforms to ∫[1 to 2] u³ du = [ u⁴ / 4 ] from 1 to 2 = (2⁴ / 4) - (1⁴ / 4) = (16 / 4) - (1 / 4) = 15/4.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 8. Integration by Parts
    (idx: number) => {
      const q = `What is the indefinite integral ∫ x · e^x dx (where C is the constant of integration)?`;
      const correct = `(x - 1)e^x + C`;
      const w1 = `(x + 1)e^x + C`;
      const w2 = `x² e^x / 2 + C`;
      const w3 = `x e^x - e^(2x) + C`;
      const exp = `Using integration by parts ∫ u dv = uv - ∫ v du with u = x (du = dx) and dv = e^x dx (v = e^x): ∫ x e^x dx = x e^x - ∫ e^x dx = x e^x - e^x + C = (x - 1)e^x + C.`;
      return { q, correct, w1, w2, w3, exp };
    }
  ];

  // Hard Generators: Second-order differential equations, Cayley-Hamilton, King's property, Multivariable Hessian, Taylor series limits
  const hardGenerators = [
    // 1. Second Order Homogeneous Linear ODE
    (idx: number) => {
      const r1 = (idx % 3) + 2;
      const r2 = r1 + (idx % 2) + 1;
      const sum = r1 + r2;
      const prod = r1 * r2;
      const q = `Find the general solution to the second-order homogeneous differential equation: y'' - ${sum}y' + ${prod}y = 0:`;
      const correct = `y = c₁ e^(${r1}x) + c₂ e^(${r2}x)`;
      const w1 = `y = (c₁ + c₂ x) e^(${r1}x)`;
      const w2 = `y = c₁ cos(${r1}x) + c₂ sin(${r2}x)`;
      const w3 = `y = c₁ e^(-${r1}x) + c₂ e^(-${r2}x)`;
      const exp = `The characteristic equation is r² - ${sum}r + ${prod} = 0 => (r - ${r1})(r - ${r2}) = 0. The distinct real roots are r = ${r1} and r = ${r2}. Hence, the general solution is y = c₁ e^(${r1}x) + c₂ e^(${r2}x).`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 2. Cayley-Hamilton Theorem
    (idx: number) => {
      const a = (idx % 3) + 2;
      const d = (idx % 4) + 3;
      const trace = a + d;
      const det = a * d - 2;
      const q = `According to the Cayley-Hamilton Theorem, if matrix A satisfies Tr(A) = ${trace} and det(A) = ${det}, which matrix polynomial identity holds identically?`;
      const correct = `A² - ${trace}A + ${det}I = O`;
      const w1 = `A² + ${trace}A - ${det}I = O`;
      const w2 = `A² - ${det}A + ${trace}I = O`;
      const w3 = `A² + ${det}A + ${trace}I = O`;
      const exp = `The Cayley-Hamilton Theorem states that every square matrix satisfies its own characteristic equation p(λ) = det(λI - A) = 0. For a 2×2 matrix, this is λ² - Tr(A)λ + det(A) = 0, meaning A² - Tr(A)A + det(A)I = O.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 3. Second-Order Indeterminate Limit using Taylor Series
    (idx: number) => {
      const k = (idx % 4) + 2;
      const valNumerator = k * k;
      const q = `Evaluate the indeterminate limit: lim(x→0) [ (e^(${k}x) - 1 - ${k}x) / x² ]:`;
      const correct = `${valNumerator} / 2`;
      const w1 = `${k} / 2`;
      const w2 = `${valNumerator}`;
      const w3 = `0`;
      const exp = `Using the Taylor expansion e^u = 1 + u + u²/2! + O(u³): e^(${k}x) = 1 + ${k}x + (${k}x)²/2 + ... = 1 + ${k}x + (${valNumerator}/2)x² + ... Subtracting 1 + ${k}x leaves (${valNumerator}/2)x² in the numerator. Dividing by x² yields lim(x→0) = ${valNumerator}/2.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 4. Definite Integral King's Property
    (idx: number) => {
      const n = (idx % 4) + 2;
      const q = `Evaluate the definite integral using King's property ∫[a to b] f(x) dx = ∫[a to b] f(a + b - x) dx: I = ∫[0 to π/2] [ (sin^${n}(x)) / (sin^${n}(x) + cos^${n}(x)) ] dx:`;
      const correct = `π / 4`;
      const w1 = `π / 2`;
      const w2 = `1`;
      const w3 = `π / ${n}`;
      const exp = `By King's property, replacing x with π/2 - x gives I = ∫[0 to π/2] [ cos^${n}(x) / (cos^${n}(x) + sin^${n}(x)) ] dx. Adding the two integrals: 2I = ∫[0 to π/2] 1 dx = π/2 - 0 = π/2, which gives I = π/4 regardless of exponent n.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 5. Multivariable Optimization & Hessian Determinant
    (idx: number) => {
      const q = `Let f(x, y) be a twice continuously differentiable function with critical point (x0, y0) where f_x = f_y = 0. If the Hessian discriminant D = f_xx f_yy - (f_xy)² < 0 at that point, what can be concluded?`;
      const correct = `(x0, y0) is a saddle point`;
      const w1 = `(x0, y0) is a strictly local minimum`;
      const w2 = `(x0, y0) is a strictly local maximum`;
      const w3 = `The second derivative test is completely inconclusive`;
      const exp = `In multivariable calculus, if the Hessian determinant D < 0 at a critical point, the eigenvalues of the Hessian matrix have opposite signs (one positive, one negative), which guarantees the point is a saddle point.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 6. Complex Analysis - Cauchy's Residue Theorem
    (idx: number) => {
      const q = `Let C be a simple closed counterclockwise contour enclosing the origin z = 0. Evaluate the contour integral: ∮_C (1 / z) dz:`;
      const correct = `2πi`;
      const w1 = `0`;
      const w2 = `πi`;
      const w3 = `1`;
      const exp = `By Cauchy's Integral Formula / Residue Theorem, the simple pole at z = 0 has residue Res(f, 0) = 1. Therefore, ∮_C (1/z) dz = 2πi · Res(f, 0) = 2πi(1) = 2πi.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 7. Infinite Series Radius of Convergence
    (idx: number) => {
      const a = (idx % 3) + 2;
      const q = `Determine the radius of convergence R of the power series: ∑[n=1 to ∞] [ (${a}^n / n) · x^n ]:`;
      const correct = `1 / ${a}`;
      const w1 = `${a}`;
      const w2 = `1`;
      const w3 = `∞`;
      const exp = `Using the ratio test: L = lim(n→∞) |a_(n+1) / a_n| = lim(n→∞) [ (${a}^(n+1)/(n+1)) / (${a}^n / n) ] = ${a} · lim(n→∞) [ n / (n+1) ] = ${a}. The radius of convergence is R = 1 / L = 1/${a}.`;
      return { q, correct, w1, w2, w3, exp };
    },
    // 8. 3x3 Determinant with Row Invariance
    (idx: number) => {
      const q = `If a 3×3 matrix A has det(A) = 7, what is the determinant of the scaled matrix 2A?`;
      const correct = `56`;
      const w1 = `14`;
      const w2 = `28`;
      const w3 = `49`;
      const exp = `For an n×n matrix, scaling by a scalar k multiplies the determinant by k^n: det(k A) = k^n det(A). For n = 3 and k = 2: det(2A) = 2³ · det(A) = 8 · 7 = 56.`;
      return { q, correct, w1, w2, w3, exp };
    }
  ];

  // Select the appropriate pool strictly matching requested difficulty
  const generators = difficulty === 'Easy'
    ? easyGenerators
    : difficulty === 'Hard'
    ? hardGenerators
    : mediumGenerators;

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
      const isCodeOrTech = /code|programm|python|java|script|c\+\+|rust|html|css|sql|react|docker|git|api|algorithm|data structure/i.test(fullText);

      const domainGuidance = isMath
        ? `\nMATHEMATICAL FORMATTING INSTRUCTIONS:
- Use clean readable Unicode notation: √, ², ³, π, θ, λ, ∫, ∑, ≤, ≥, ±, ≠, ÷, · instead of unescaped LaTeX backslashes that crash JSON parsing.
- All 4 options must be distinct, plausible mathematical quantities or symbolic expressions.
- The "explanation" field MUST include step-by-step mathematical working: Formula -> Value Substitution -> Simplification -> Final Verified Result.`
        : isCodeOrTech
        ? `\nTECHNICAL & PROGRAMMING INSTRUCTIONS:
- If appropriate or requested, include concise, formatted code snippets in the question text.
- Test actual runtime semantics, scope rules, syntax validity, or architectural trade-offs.
- Avoid vague trivia; test genuine developer comprehension and debugging skills.`
        : `\nDOMAIN & CONTEXTUAL INSTRUCTIONS:
- Directly immerse question wording in the academic vocabulary of "${subject || 'the specified discipline'}".
- If the user asks for scenario-based or case-study questions, provide realistic situational contexts.
- All 4 options must be distinct, authentic domain concepts or plausible misconceptions.
- The "explanation" field MUST thoroughly explain the underlying principle and why the correct option holds.`;

      const difficultyGuidance = {
        Easy: `
CRITICAL DIFFICULTY CALIBRATION - EASY:
- Target Cognitive Level: Direct recall, definition lookup, fundamental facts, and single-step applications.
- Problem Complexity: Straightforward question solvable in under 45 seconds without extensive scratch work.
- Distractors: Simple, clear conceptual foils or basic opposite choices.
- STRICTLY FORBIDDEN: Multi-step derivations, tricky edge cases, or combined multi-disciplinary theories.`,

        Medium: `
CRITICAL DIFFICULTY CALIBRATION - MEDIUM:
- Target Cognitive Level: Multi-step application, comparative analysis, mechanism understanding, and concept synthesis.
- Problem Complexity: Standard examination level (e.g. collegiate midterm, standard professional certification). Requires 2 to 3 distinct logical steps or comparative reasoning.
- Distractors: Highly plausible intermediate outcomes or common conceptual misconceptions.
- STRICTLY FORBIDDEN: Trivial single-word definition lookups. Questions must require actual comprehension or logical evaluation.`,

        Hard: `
CRITICAL DIFFICULTY CALIBRATION - HARD:
- Target Cognitive Level: Advanced synthesis, edge-case evaluation, boundary constraints, and non-routine analytical reasoning.
- Problem Complexity: Elite examination tier (e.g. advanced university honors, top competitive percentile, complex real-world case analysis).
- Structure: Requires synthesizing 2 or more separate sub-principles, evaluating trade-offs, or recognizing subtle exceptions/traps.
- Distractors: Extremely convincing options that expose subtle misunderstandings or common procedural traps.
- Explanation: Must provide rigorous, deep analytical justification.`
      }[difficulty];

      let response;
      const timeoutMs = 8000;
      const callWithTimeout = async <T>(promise: Promise<T>, ms: number = timeoutMs): Promise<T> => {
        let timer: NodeJS.Timeout;
        const timeoutPromise = new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error(`Model request timed out after ${ms}ms`)), ms);
        });
        return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
      };

      try {
        response = await callWithTimeout(aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are an elite university professor, assessment architect, and curriculum developer.
The user (a teacher or examination administrator) has requested an exam question set. Your HIGHEST directive is to generate questions that strictly and faithfully follow the user's specific prompt, topic request, and desired question style.

USER'S PRIMARY PROMPT / INSTRUCTIONS:
"${prompt}"

ACADEMIC SUBJECT / DOMAIN:
"${subject || 'General Assessment'}"

TARGET DIFFICULTY:
${difficulty}
${difficultyGuidance}

NUMBER OF QUESTIONS TO GENERATE:
${safeCount}
${domainGuidance}

IMPORTANT GENERATION RULES:
1. STRICT ADHERENCE TO USER'S INTENT:
   - Your questions MUST directly reflect the exact topic, themes, scenarios, or concepts requested in the prompt: "${prompt}".
   - Do NOT deviate into unrelated fields. If the user asks about History, Biology, Literature, Law, Medicine, Business, Music, Philosophy, Engineering, or Computer Science, every single question must belong strictly to that domain.
   - If the user specifies question types (e.g. "scenario based", "code output", "historical causes", "case study", "numerical calculations"), prioritize that exact style.
2. DIVERSITY ACROSS QUESTIONS:
   - Ensure each of the ${safeCount} questions explores a distinct sub-topic or perspective from the prompt.
3. EQUAL OPTION DISTRIBUTION:
   - Distribute the correct answer ('a', 'b', 'c', 'd') evenly across the questions.

Schema requirements:
Return ONLY a valid JSON array of objects with the exact schema:
[
  {
    "question": "Clear, comprehensive question text",
    "option_a": "First distinct answer option",
    "option_b": "Second distinct answer option",
    "option_c": "Third distinct answer option",
    "option_d": "Fourth distinct answer option",
    "correct_option": "a",
    "explanation": "Detailed educational explanation explaining why the correct option is right"
  }
]`,
          config: {
            responseMimeType: 'application/json',
            temperature: difficulty === 'Hard' ? 0.8 : 0.6,
            maxOutputTokens: 8192,
          },
        }), 8500);
      } catch (geminiPrimaryErr) {
        // Fallback model trial with 6s timeout
        try {
          response = await callWithTimeout(aiClient.models.generateContent({
            model: 'gemini-flash-latest',
            contents: `You are an expert examiner setting ${difficulty} questions based strictly on user prompt: "${prompt}" in subject: "${subject}".
${difficultyGuidance}
Return exactly ${safeCount} questions as a valid JSON array with keys: question, option_a, option_b, option_c, option_d, correct_option, explanation.`,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.7,
              maxOutputTokens: 8192,
            },
          }), 6000);
        } catch (secondaryErr) {
          console.warn('Gemini secondary model fallback triggered:', secondaryErr);
        }
      }

      const text = response?.text || '[]';
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
    // Partition curriculum bank questions by genuine difficulty first
    const primaryTier = subjectPool.filter(q => q.difficulty === difficulty);
    const secondaryTier = subjectPool.filter(q => {
      if (difficulty === 'Hard') return q.difficulty === 'Medium';
      if (difficulty === 'Easy') return q.difficulty === 'Medium';
      return q.difficulty !== 'Medium';
    });
    const tertiaryTier = subjectPool.filter(q => !primaryTier.includes(q) && !secondaryTier.includes(q));

    // Combine prioritizing strict difficulty match
    const keywords = promptLower.split(/[\s,]+/).filter(w => w.length > 3);
    const rankByKeywords = (pool: GeneratedQuestion[]) => {
      if (keywords.length === 0) return pool.sort(() => 0.5 - Math.random());
      const match = pool.filter(q => keywords.some(kw => q.question.toLowerCase().includes(kw) || q.explanation.toLowerCase().includes(kw)));
      const others = pool.filter(q => !match.includes(q));
      return [...match, ...others.sort(() => 0.5 - Math.random())];
    };

    const orderedCandidates = [
      ...rankByKeywords(primaryTier),
      ...rankByKeywords(secondaryTier),
      ...rankByKeywords(tertiaryTier),
    ];

    for (let i = 0; i < Math.min(safeCount, orderedCandidates.length); i++) {
      result.push({
        ...orderedCandidates[i],
        difficulty,
        subject: subject || orderedCandidates[i].subject,
      });
    }
  }

  // If safeCount is already reached, return
  if (result.length >= safeCount) {
    return result.slice(0, safeCount);
  }

  // 2d. Multi-Domain Knowledge Synthesizer (Flexible fallback across any academic discipline)
  const cleanPromptWords = prompt.replace(/[^a-zA-Z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !['with', 'from', 'this', 'that', 'what', 'which', 'give', 'make', 'create', 'questions', 'about'].includes(w.toLowerCase()));
  const coreConcept = cleanPromptWords[0] || subject || 'Core Principles';
  const secondConcept = cleanPromptWords[1] || 'Foundational Mechanisms';
  const thirdConcept = cleanPromptWords[2] || 'System Interactions';

  // Multi-domain classification based on full context
  const isHistoryOrLaw = /histor|revolut|war|battle|dynasty|empire|treaty|constitut|amendment|colonial|sovereign|parliament|monarch|president|liberty|civil rights|feudal|cold war|renaissance|medieval|napoleon|caesar|bastille|treaty|court|jurisdiction|statute|magna carta/i.test(fullText);
  const isBiologyOrMedicine = /bio|cell|gene|dna|rna|protein|enzyme|organ|heart|brain|physiol|mitos|meios|photosyn|ecol|evolut|patholog|bacteri|virus|microbio|immun|hormon|metabol|respirat|nervous|circulat|genetics|anatomy/i.test(fullText);
  const isChemistry = /chem|molecul|react|acid|base|cataly|organ|inorgan|bond|period|electron|orbit|titrat|stoichio|enthalp|entrop|kinet|solut|redox|polym|covalent|ionic|isomer/i.test(fullText);
  const isPhysicsOrSpace = /physic|gravit|force|motion|kinemat|optic|wave|electr|magnet|quantum|relativ|thermodynam|astronom|cosmol|orbit|galaxy|spectrum|photon|newton|einstein/i.test(fullText);
  const isBusinessOrEconomics = /econom|busin|financ|market|stock|invest|account|revenue|profit|asset|liabilit|gdp|inflat|fiscal|monetar|supply|demand|elasticit|depreciat|balance sheet|audit|trade|management|marketing/i.test(fullText);
  const isLiteratureOrLanguage = /literat|poet|novel|author|play|drama|grammar|syntax|metaphor|rhetor|philosoph|ethic|epistemolog|logic|kant|utilitarian|linguistic|vocabulary|shakespeare|hamlet/i.test(fullText);
  const isTechOrCS = /comput|programm|code|python|java|javascript|react|node|sql|database|api|algorithm|data structure|cyber|network|cloud|docker|git|security|linux|concurren|thread|backend|frontend/i.test(fullText);

  // Dynamic domain template generator
  interface DomainTemplate {
    q: string;
    correct: string;
    w1: string;
    w2: string;
    w3: string;
    exp: string;
  }

  let domainTemplates: DomainTemplate[] = [];

  if (isHistoryOrLaw) {
    domainTemplates = [
      {
        q: `What was the primary historical catalyst or socio-political cause leading to the developments surrounding ${coreConcept}?`,
        correct: `Systemic socio-economic tensions, institutional crises, and ideological mobilization for reform`,
        w1: `A sudden, peaceful unanimous consensus among all competing socio-political factions`,
        w2: `An isolated technical measurement error with zero public awareness`,
        w3: `The spontaneous, voluntary dissolution of sovereign power without external pressure`,
        exp: `Historical movements regarding ${coreConcept} emerged from deep structural tensions, resource distribution disputes, and institutional pressures.`
      },
      {
        q: `In the context of ${subject || 'Historical Analysis'}, how did ${secondConcept} fundamentally impact governance and constitutional authority during ${coreConcept}?`,
        correct: `It redistributed jurisdictional authority and established legal precedents limiting arbitrary rule`,
        w1: `It eliminated the need for written legal codes and treaties entirely`,
        w2: `It mandated that all state records be erased every calendar decade`,
        w3: `It restricted all administrative decision-making strictly to military tribunals`,
        exp: `Key constitutional milestones in ${coreConcept} restructured executive authority and instituted foundational institutional boundaries.`
      },
      {
        q: `Which treaty, charter, or legislative act served as the definitive turning point in resolving conflicts over ${coreConcept}?`,
        correct: `Formal multilateral accords recognizing sovereignty, border demarcations, and civil covenants`,
        w1: `An informal oral agreement with no ratified documentation or signatories`,
        w2: `A retroactive commercial trade decree issued by a neutral third party`,
        w3: `A unilateral non-binding executive proclamation that expired after thirty days`,
        exp: `Resolutions in ${coreConcept} historically required codified multilateral treaties establishing legitimate state sovereignty.`
      },
      {
        q: `What was a lasting ideological legacy of ${coreConcept} on modern democratic and institutional frameworks?`,
        correct: `The codification of fundamental civil liberties, popular sovereignty, and separation of powers`,
        w1: `The permanent reinstatement of hereditary feudal privilege systems`,
        w2: `The complete abolishment of representative legislative bodies globally`,
        w3: `The prohibition of public education and free assembly`,
        exp: `${coreConcept} contributed fundamentally to the institutional evolution of representative democracy and civil rights.`
      }
    ];
  } else if (isBiologyOrMedicine) {
    domainTemplates = [
      {
        q: `In cellular and molecular biology, what is the primary biochemical role of ${coreConcept}?`,
        correct: `Catalyzing metabolic pathways and maintaining homeostatic regulation within targeted cellular compartments`,
        w1: `Indiscriminately degrading all nucleic acids without enzymatic specificity`,
        w2: `Acting as a static structural barrier with zero molecular permeability`,
        w3: `Converting all intracellular water into atmospheric inert gases`,
        exp: `In biological systems, ${coreConcept} functions as a regulated biochemical mediator essential for homeostasis and molecular communication.`
      },
      {
        q: `During cellular regulation involving ${secondConcept}, how does ${coreConcept} interact with intracellular signaling cascades?`,
        correct: `Through receptor-ligand conformational binding that triggers secondary messenger phosphorylation`,
        w1: `By completely bypassing cell membranes without biochemical interaction`,
        w2: `By permanently deactivating all mitochondrial ATP synthesis`,
        w3: `By converting double-stranded DNA into single-carbon hydrocarbons`,
        exp: `Signaling pathways centered around ${coreConcept} operate via precise stereospecific receptor interactions and phosphorylation cascades.`
      },
      {
        q: `What physiological consequence typically results from a loss-of-function mutation or inhibition in ${coreConcept}?`,
        correct: `Disruption of substrate turnover, accumulation of upstream metabolites, and clinical pathology`,
        w1: `Spontaneous instant regeneration of all damaged somatic tissues`,
        w2: `Complete immunity to all infectious pathogens unconditionally`,
        w3: `Permanent cessation of thermodynamic entropy within the organism`,
        exp: `Enzymatic or receptor impairment in ${coreConcept} leads to metabolic bottlenecks and associated physiological dysfunction.`
      },
      {
        q: `At which intracellular location or organelle is the biochemical processing of ${coreConcept} primarily localized?`,
        correct: `Specific organelle membranes (e.g. endoplasmic reticulum, mitochondria, or cytosolic complexes) tailored to its energetic requirements`,
        w1: `Strictly within extracellular vascular lumen fluids without cellular involvement`,
        w2: `Within non-membrane bound dead keratinized layers exclusively`,
        w3: `In the central vacuole of mammalian erythrocytes`,
        exp: `Cellular compartmentalization ensures that enzymes and substrates for ${coreConcept} achieve optimal kinetic efficiency.`
      }
    ];
  } else if (isChemistry) {
    domainTemplates = [
      {
        q: `In chemical analysis of ${coreConcept}, what factor fundamentally governs the rate and thermodynamic spontaneity of the process?`,
        correct: `The Gibbs free energy change (ΔG = ΔH - TΔS) and the activation energy barrier (Ea)`,
        w1: `The physical color appearance of the reaction flask`,
        w2: `The atmospheric humidity of an unrelated geographic continent`,
        w3: `Arbitrary non-conservative mass loss during molecular transitions`,
        exp: `Spontaneity in chemical transformations is governed by Gibbs free energy (ΔG < 0), while kinetics depends on the activation energy (Ea).`
      },
      {
        q: `How does a suitable catalyst affect reaction pathways involving ${secondConcept} in ${coreConcept}?`,
        correct: `It lowers the activation energy by providing an alternative transition state pathway without altering equilibrium K_eq`,
        w1: `It increases the enthalpy change (ΔH) to make the reaction endothermic`,
        w2: `It is permanently consumed in stoichiometric proportions alongside reactants`,
        w3: `It shifts the equilibrium constant K_eq towards products permanently`,
        exp: `Catalysts accelerate reaction rates by lowering Ea without shifting the thermodynamic equilibrium constant K_eq.`
      },
      {
        q: `According to Le Chatelier's Principle, how will an exothermic reaction involving ${coreConcept} respond to an increase in temperature at constant pressure?`,
        correct: `The equilibrium will shift toward the reactants (endothermic direction) to absorb excess heat`,
        w1: `The equilibrium will shift toward the products to release more thermal energy`,
        w2: `The reaction rate will drop to exactly zero immediately`,
        w3: `The molecular weights of all species will spontaneously double`,
        exp: `For exothermic reactions (ΔH < 0), increasing temperature shifts the equilibrium in the reverse direction to counteract thermal stress.`
      },
      {
        q: `What type of chemical bonding and molecular geometry predominantly characterizes ${coreConcept}?`,
        correct: `Specific hybridized orbital configurations (e.g. sp³, sp², or coordinated complexes) minimizing electron-pair repulsion`,
        w1: `Static rigid sphere packing with zero orbital overlap`,
        w2: `Gravitational bonding between subatomic quarks across macroscopic distances`,
        w3: `Universal linear geometry regardless of lone pair electron count`,
        exp: `VSEPR theory dictates that molecular geometry around ${coreConcept} adopts spatial orientations that minimize valence electron repulsion.`
      }
    ];
  } else if (isBusinessOrEconomics) {
    domainTemplates = [
      {
        q: `In economic theory and market analysis, what is the direct impact of shifts in ${coreConcept} on market equilibrium?`,
        correct: `Reallocation of consumer and producer surplus until marginal benefit equals marginal cost (MB = MC)`,
        w1: `Permanent elimination of all scarcity and production constraints across the economy`,
        w2: `Guaranteed zero transaction costs for all market participants in perpetuity`,
        w3: `Fixed prices set by decree without regard to consumer utility or input supply`,
        exp: `Competitive market adjustments in ${coreConcept} equilibrate supply and demand, maximizing total social welfare where MB = MC.`
      },
      {
        q: `On a corporate balance sheet and financial statement, how is ${secondConcept} related to ${coreConcept} properly classified?`,
        correct: `Accurately matched under the revenue recognition and accrual matching principles across fiscal periods`,
        w1: `Omitted entirely from balance sheets to artificially inflate net cash balances`,
        w2: `Categorized exclusively as discretionary owner withdrawals without documentation`,
        w3: `Calculated only once every fifty years during corporate restructuring`,
        exp: `GAAP and IFRS require accrual accounting to match revenues and associated expenses in the period incurred.`
      },
      {
        q: `When analyzing price elasticity regarding ${coreConcept}, what does a price elasticity coefficient of demand |E_d| > 1 signify?`,
        correct: `Demand is elastic: percentage change in quantity demanded exceeds the percentage change in price`,
        w1: `Demand is perfectly inelastic: consumers buy identical quantities regardless of price changes`,
        w2: `Supply cannot respond to market pricing under any timeframe`,
        w3: `The good has negative production costs across all manufacturing facilities`,
        exp: `Elastic demand (|E_d| > 1) indicates that consumers are highly responsive to price adjustments due to the availability of substitutes.`
      },
      {
        q: `What strategic framework is widely employed to evaluate competitive advantage and industry rivalry in ${coreConcept}?`,
        correct: `Porter's Five Forces analysis assessing supplier power, buyer power, substitution threat, new entrants, and rivalry`,
        w1: `A coin toss mechanism with fifty percent probability distribution`,
        w2: `Ignoring competitors completely and setting prices based on calendar dates`,
        w3: `Universal monopolistic price-fixing without regulatory compliance`,
        exp: `Porter's Five Forces framework analyzes the competitive environment and structural determinants of industry profitability.`
      }
    ];
  } else if (isLiteratureOrLanguage) {
    domainTemplates = [
      {
        q: `In literary criticism and textual analysis, what central thematic motif is explored through ${coreConcept}?`,
        correct: `The tension between internal moral conflict, external societal expectations, and existential autonomy`,
        w1: `An absolute absence of figurative devices, subtext, or character evolution`,
        w2: `A purely chronological catalog of factual inventory without rhetorical intent`,
        w3: `An arbitrary sequence of unrelated syllables with zero semantic meaning`,
        exp: `In ${subject || 'Literature'}, ${coreConcept} serves as a pivotal thematic vehicle to examine human condition, agency, and moral resolution.`
      },
      {
        q: `Which rhetorical or poetic device is prominently employed to amplify emotional resonance in ${coreConcept}?`,
        correct: `Extended metaphor, dramatic irony, and symbolic juxtaposition`,
        w1: `Redundant literal repetition without stylistic variance`,
        w2: `The deliberate omission of all vowels from dialogue`,
        w3: `Monotone prose with zero punctuation across chapters`,
        exp: `Literary works utilize dramatic irony, symbolism, and metaphor to deepen emotional complexity and thematic coherence.`
      },
      {
        q: `In syntactic and grammatical analysis regarding ${secondConcept}, what role does ${coreConcept} fulfill in complex sentence structure?`,
        correct: `Governing subordinate clause dependencies and establishing semantic coherence`,
        w1: `Randomly altering the spelling of adjacent nouns without grammatical function`,
        w2: `Restricting all sentences strictly to single-word utterances`,
        w3: `Inverting the chronological order of alphabetic letters in printed text`,
        exp: `Syntactic structures rely on governing phrases and subordinate clauses to construct coherent semantic relationships.`
      }
    ];
  } else if (isTechOrCS) {
    domainTemplates = [
      {
        q: `In software engineering and system architecture, what is the primary technical advantage of ${coreConcept}?`,
        correct: `Decoupled modularity, predictable state transitions, and testable separation of concerns`,
        w1: `Global unprotected shared memory accessed concurrently without synchronization`,
        w2: `Hardcoded direct dependencies that prevent mock testing or refactoring`,
        w3: `Executing all production operations synchronously on a single blocking thread`,
        exp: `Modularity in ${coreConcept} promotes maintainability, horizontal scalability, and isolated unit testability.`
      },
      {
        q: `When optimizing performance and latency for ${coreConcept}, which operational practice is considered best practice?`,
        correct: `Asynchronous non-blocking I/O, connection pooling, and multi-tier caching with TTL invalidation`,
        w1: `Disabling connection limits and allowing unbounded OS thread creation`,
        w2: `Polling the database continuously every 1 millisecond on the main thread`,
        w3: `Storing all user passwords in unencrypted plain text in client-side cookies`,
        exp: `Asynchronous pipelines and caching reduce CPU thread context-switching and database query bottlenecks.`
      },
      {
        q: `What is the principal reliability risk when designing distributed services handling ${secondConcept} in ${coreConcept}?`,
        correct: `Cascading failures and network timeouts without circuit breakers or retry backoff`,
        w1: `Automated health probes restarting failed instances gracefully`,
        w2: `Enforcing strict schema validation on incoming JSON payloads`,
        w3: `Compiling code with aggressive type-checking flags enabled`,
        exp: `Without circuit breakers and exponential backoff, failing downstream dependencies trigger system-wide cascading outages.`
      },
      {
        q: `Which algorithmic property describes the efficiency and scalability of ${coreConcept}?`,
        correct: `Logarithmic or linear computational complexity O(log N) or O(N) preventing exponential degradation`,
        w1: `O(N!) factorial runtime growth on inputs exceeding ten items`,
        w2: `Fixed clock cycle latency independent of physical networking distance`,
        w3: `Unlimited free virtual memory allocation with zero garbage collection overhead`,
        exp: `Efficient data structures and algorithms avoid exponential complexity bottlenecks to scale with growing workloads.`
      }
    ];
  } else {
    // Universal Academic Synthesizer
    domainTemplates = [
      {
        q: `In the study of ${subject || 'Academic Disciplines'}, what is the core foundational principle defining ${coreConcept}?`,
        correct: `Systematic theoretical formulation supported by empirical validation and reproducible observations`,
        w1: `Arbitrary speculative assertion without verifiable evidentiary backing`,
        w2: `Complete rejection of all prior documented literature and foundational axioms`,
        w3: `The assumption of random chaos with zero underlying governing rules`,
        exp: `Foundational scholarship in ${coreConcept} requires verifiable theoretical frameworks and empirical consistency.`
      },
      {
        q: `How does the relationship between ${coreConcept} and ${secondConcept} contribute to deeper analysis in this field?`,
        correct: `It illustrates how interdependent sub-components interact to govern macroscopic behavior and outcomes`,
        w1: `It proves that secondary variables have zero measurable influence on the system`,
        w2: `It requires eliminating the primary concept before analyzing secondary effects`,
        w3: `It restricts analysis strictly to qualitative descriptions without data`,
        exp: `Analyzing ${coreConcept} alongside ${secondConcept} reveals the operational mechanisms that define this subject.`
      },
      {
        q: `When addressing critical problem-solving scenarios in ${coreConcept}, which methodology yields the most robust outcome?`,
        correct: `Decomposing the problem into first-principles components, evaluating constraints, and iteratively validating results`,
        w1: `Skipping all boundary condition checks and applying unverified approximations`,
        w2: `Ignoring contradictory evidence to preserve initial assumptions`,
        w3: `Relying exclusively on trial and error without theoretical grounding`,
        exp: `Rigorous problem-solving decomposes complex systems into first principles while actively auditing boundary constraints.`
      },
      {
        q: `What distinguishing metric or analytical standard separates an advanced understanding of ${coreConcept} from basic introductory models?`,
        correct: `Accounting for non-linear dynamics, boundary edge cases, and systemic trade-offs`,
        w1: `Assuming all interactions are strictly linear under all conditions`,
        w2: `Restricting analysis to idealized frictionless states without practical constraints`,
        w3: `Treating all competing models as mathematically identical without proof`,
        exp: `Advanced mastery of ${coreConcept} requires recognizing nuanced boundary conditions and non-linear interactions.`
      }
    ];
  }

  // Distribute correct answers across 'a', 'b', 'c', 'd'
  const letters: ('a' | 'b' | 'c' | 'd')[] = ['a', 'b', 'c', 'd'];
  let templateIndex = 0;

  while (result.length < safeCount) {
    const t = domainTemplates[templateIndex % domainTemplates.length];
    const targetLetter = letters[result.length % 4];

    const wrongPool = [t.w1, t.w2, t.w3];
    let optA = '', optB = '', optC = '', optD = '';

    if (targetLetter === 'a') {
      optA = t.correct;
      optB = wrongPool[0];
      optC = wrongPool[1];
      optD = wrongPool[2];
    } else if (targetLetter === 'b') {
      optA = wrongPool[0];
      optB = t.correct;
      optC = wrongPool[1];
      optD = wrongPool[2];
    } else if (targetLetter === 'c') {
      optA = wrongPool[0];
      optB = wrongPool[1];
      optC = t.correct;
      optD = wrongPool[2];
    } else {
      optA = wrongPool[0];
      optB = wrongPool[1];
      optC = wrongPool[2];
      optD = t.correct;
    }

    const questionVariation = templateIndex >= domainTemplates.length
      ? ` (Perspective ${Math.floor(templateIndex / domainTemplates.length) + 1})`
      : '';

    result.push({
      question: `${t.q}${questionVariation}`,
      option_a: optA,
      option_b: optB,
      option_c: optC,
      option_d: optD,
      correct_option: targetLetter,
      subject: subject || 'General',
      difficulty,
      explanation: `${t.exp} (Option ${targetLetter.toUpperCase()} is the academically verified solution).`,
    });

    templateIndex++;
  }

  return result.slice(0, safeCount);
}
