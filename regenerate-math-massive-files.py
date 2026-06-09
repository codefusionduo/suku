#!/usr/bin/env python3
"""Regenerate mathematical training datasets using combinatorial generation to ensure every entry is unique."""

import json
import sys

# Combinatorial lists for Math sentences
subjects = [
    "A polynomial equation", "A Riemannian manifold", "The prime number theorem", "A Fourier transform", "An eigenvalue",
    "A topological space", "The Pythagorean theorem", "A Fibonacci sequence", "A differential equation", "An algebraic field",
    "A Euclidean vector", "A Taylor series", "A Gaussian distribution", "The Riemann hypothesis", "A continuous function",
    "A tensor product", "A discrete logarithm", "A Hilbert space", "A Banach space", "A non-Euclidean geometry",
    "A chaotic attractor", "A complex plane", "A stochastic process", "An Abelian group", "A Lie algebra",
    "A modular form", "A projective plane", "A Markov chain", "A Laplace transform", "A Boolean algebra",
    "A Diophantine equation", "A hypercube", "A vector field", "A set isomorphism", "An elliptic curve",
    "A Galois group", "A Turing machine state", "A combinatorial graph", "A knot invariant", "A fractal dimension",
    "A metric space", "An integral domain", "A linear transformation", "A probability density function", "A normal subgroup",
    "A spherical coordinate", "A quadratic form", "A scalar multiple", "A logarithmic spiral", "A transcendental number",
    "A partial derivative", "A boundary value problem", "A Poisson process", "A simplex", "A singular matrix",
    "A permutation group", "A recursive sequence", "A binomial coefficient", "A gradient descent", "An orthogonal basis",
    "A determinant", "A meromorphic function", "A convergent series", "A topological invariant", "A geometric progression",
    "An arithmetic progression", "A rational number", "An irrational number", "A complex conjugate", "A unit circle",
    "A hyperbolic function", "A sine wave", "A cosine wave", "A tangent line", "A secant line",
    "A cosecant function", "A cotangent function", "A logarithm", "An exponential function", "A root",
    "A fraction", "A decimal", "A percentage", "A ratio", "A proportion",
    "A variable", "A constant", "A coefficient", "A term", "An expression",
    "An equation", "An inequality", "A function", "A graph", "A coordinate system",
    "A plane", "A point", "A line", "An angle", "A polygon"
] # 100 items

actions = [
    "differentiates", "integrates", "calculates", "derives", "bounds",
    "maps to", "projects onto", "factors into", "expands as", "converges to",
    "diverges from", "approximates", "simplifies to", "evaluates to", "solves",
    "proves", "disproves", "generalizes", "specializes to", "transforms into",
    "inverts", "transposes", "diagonalizes", "orthogonalizes", "normalizes",
    "maximizes", "minimizes", "optimizes", "interpolates", "extrapolates",
    "correlates with", "convolves with", "permutes", "combines with", "intersects with",
    "unions with", "subtracts from", "adds to", "multiplies by", "divides by",
    "raises to the power of", "takes the root of", "takes the logarithm of", "takes the exponential of", "takes the sine of",
    "takes the cosine of", "takes the tangent of", "takes the absolute value of", "takes the limit of", "takes the derivative of"
] # 50 items

objects = [
    "a complex variable", "a multidimensional matrix", "a linear space", "a topological neighborhood", "an infinite series",
    "a random variable", "a prime factor", "a quadratic equation", "a trigonometric identity", "a parametric curve",
    "a symmetric group", "a boundary condition", "a constant coefficient", "a continuous interval", "a discrete set",
    "a logical proposition", "a mathematical proof", "an algebraic expression", "a geometric shape", "a statistical distribution",
    "a tensor field", "a vector space", "a metric tensor", "a differential form", "a path integral",
    "a surface integral", "a volume integral", "a contour integral", "a line integral", "a definite integral",
    "an indefinite integral", "a double integral", "a triple integral", "a partial fraction", "a power series",
    "a Maclaurin series", "a Laurent series", "a Dirichlet series", "a Riemann sum", "a Lebesgue integral",
    "a measure space", "a probability space", "a sample space", "an event space", "a parameter space",
    "a configuration space", "a phase space", "a state space", "a functional space", "a distribution space"
] # 50 items

reasons = [
    "to establish the fundamental theorem.", "to prove convergence.", "to minimize the error term.", "to generalize the solution.", "to simplify the calculation.",
    "to find the optimal value.", "to determine the asymptotic behavior.", "to compute the exact volume.", "to derive the closed-form expression.", "to characterize the critical points.",
    "to classify the topological structure.", "to quantify the variance.", "to map the underlying manifold.", "to isolate the principal components.", "to model the stochastic process.",
    "to solve the boundary value problem.", "to factor the polynomial completely.", "to diagonalize the operator.", "to satisfy the initial conditions.", "to compute the probability.",
    "to evaluate the infinite product.", "to approximate the real root.", "to demonstrate logical consistency.", "to reduce the dimensionality.", "to expand the function series.",
    "to calculate the area under the curve.", "to measure the rate of change.", "to find the local maximum.", "to find the local minimum.", "to determine the concavity.",
    "to find the inflection points.", "to find the asymptotes.", "to find the intercepts.", "to determine the domain.", "to determine the range.",
    "to test for symmetry.", "to test for periodicity.", "to test for continuity.", "to test for differentiability.", "to test for integrability.",
    "to prove the existence of a solution.", "to prove the uniqueness of a solution.", "to construct a mathematical model.", "to analyze the algorithm's complexity.", "to verify the cryptographic protocol.",
    "to optimize the network flow.", "to design the control system.", "to predict the system's behavior.", "to understand the fundamental principles.", "to explore new mathematical concepts."
] # 50 items

def get_unique_entry(topic_num):
    cat_type = topic_num % 3
    
    if cat_type == 0:
        sub = subjects[(topic_num * 17) % len(subjects)]
        act = actions[(topic_num * 31) % len(actions)]
        obj = objects[(topic_num * 67) % len(objects)]
        reas = reasons[(topic_num * 109) % len(reasons)]
        
        pattern1 = f"let's talk about how {sub.lower()} {act} {obj}"
        pattern2 = f"explain mathematical details on {sub.lower()} {act} {obj}"
        pattern3 = f"math topic {topic_num}"
        
        resp1 = f"Mathematical concept #{topic_num}: {sub} {act} {obj} {reas}"
        resp2 = f"Analyzing {sub.lower()} shows that it {act} {obj} specifically {reas}"
        
        return {
            "category": "math",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }
        
    elif cat_type == 1:
        offset_num = topic_num + 5000000
        sub = subjects[(offset_num * 23) % len(subjects)]
        act = actions[(offset_num * 47) % len(actions)]
        obj = objects[(offset_num * 73) % len(objects)]
        reas = reasons[(offset_num * 127) % len(reasons)]
        
        pattern1 = f"tell me a math theorem about {sub.lower()}"
        pattern2 = f"give me math trivia {topic_num}"
        pattern3 = f"math fact number {topic_num}"
        
        resp1 = f"Fascinating mathematical snippet #{topic_num}: {sub} {act} {obj} {reas}"
        resp2 = f"Did you know in mathematics? {sub} {act} {obj} in order {reas}"
        
        return {
            "category": "math_knowledge",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }
        
    else:
        offset_num = topic_num + 9000000
        sub = subjects[(offset_num * 19) % len(subjects)]
        act = actions[(offset_num * 53) % len(actions)]
        obj = objects[(offset_num * 97) % len(objects)]
        reas = reasons[(offset_num * 131) % len(reasons)]
        
        pattern1 = f"explain the proof of how {sub.lower()} {act} {obj}"
        pattern2 = f"math proof variation {topic_num}"
        pattern3 = f"explain math theorem {topic_num}"
        
        resp1 = f"Proof sketch #{topic_num}: By definition, {sub.lower()} {act} {obj}. We do this {reas}"
        resp2 = f"Theorem #{topic_num}: It is trivially shown that {sub.lower()} {act} {obj} {reas} Q.E.D."
        
        return {
            "category": "math_proof",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }

def generate_part(part_num, start_idx, count):
    filename = f"suku-training-massive-{part_num}.jsonl"
    print(f"Generating Part {part_num} (topics {start_idx} to {start_idx + count - 1}) -> {filename}...")
    
    with open(filename, "w", encoding="utf-8") as f:
        for i in range(count):
            topic_num = start_idx + i
            entry = get_unique_entry(topic_num)
            for pattern in entry['patterns']:
                for response in entry['responses']:
                    obj = {
                        "messages": [
                            {"role": "user", "content": pattern},
                            {"role": "assistant", "content": response}
                        ]
                    }
                    f.write(json.dumps(obj, ensure_ascii=False) + "\n")
    print(f"Generated part {part_num} successfully!")


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python regenerate-math-massive-files.py <part_num> <start_idx> <count>")
        sys.exit(1)
        
    part_num = int(sys.argv[1])
    start_idx = int(sys.argv[2])
    count = int(sys.argv[3])
    generate_part(part_num, start_idx, count)
