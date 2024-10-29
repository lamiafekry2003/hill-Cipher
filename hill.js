function letterToNumber(letter) {
    return letter.charCodeAt(0) - 'A'.charCodeAt(0);
}

function numberToLetter(number) {
    return String.fromCharCode(number + 'A'.charCodeAt(0));
}

function createKeyMatrix(key) {
    return [[parseInt(key[0]), parseInt(key[1])], [parseInt(key[2]), parseInt(key[3])]];
}

function determinant(matrix) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
}

function modInverse(a, m) {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return null;
}

function inverseMatrix(matrix) {
    const det = determinant(matrix);
    const detInv = modInverse(det, 26);
    if (detInv === null) {
        throw new Error("Matrix is not invertible. Choose a different key.");
    }
    return [
        [(matrix[1][1] * detInv) % 26, (-matrix[0][1] * detInv) % 26],
        [(-matrix[1][0] * detInv) % 26, (matrix[0][0] * detInv) % 26]
    ];
}

function vectorMatrixMultiplication(matrix, vector) {
    return [
        (matrix[0][0] * vector[0] + matrix[0][1] * vector[1]) % 26,
        (matrix[1][0] * vector[0] + matrix[1][1] * vector[1]) % 26
    ];
}

function hillEncrypt(plaintext, keyMatrix) {
    let encrypted = "";
    for (let i = 0; i < plaintext.length; i += 2) {
        const vector = [letterToNumber(plaintext[i]), letterToNumber(plaintext[i + 1])];
        const encryptedVector = vectorMatrixMultiplication(keyMatrix, vector);
        encrypted += numberToLetter(encryptedVector[0]) + numberToLetter(encryptedVector[1]);
    }
    return encrypted;
}

function hillDecrypt(ciphertext, keyMatrix) {
    let decrypted = "";
    const invKeyMatrix = inverseMatrix(keyMatrix);
    for (let i = 0; i < ciphertext.length; i += 2) {
        const vector = [letterToNumber(ciphertext[i]), letterToNumber(ciphertext[i + 1])];
        const decryptedVector = vectorMatrixMultiplication(invKeyMatrix, vector);
        decrypted += numberToLetter(decryptedVector[0]) + numberToLetter(decryptedVector[1]);
    }
    return decrypted;
}

document.getElementById('encryptBtn').addEventListener('click', () => {
    const key = document.getElementById('key').value;
    const plaintext = document.getElementById('plaintext').value.toUpperCase();
    let error = document.getElementById('alert');
    let sucess = document.getElementById('success')
    if (plaintext.length % 2 !== 0 || plaintext.length == 0) {
        alert("Plaintext must be even. Adding 'X' to the end.");
        plaintext += 'X';  // Padding if necessary
        error.classList.remove('hidden');
        error.classList.add('slide-in');
        setTimeout(function() {
            error.classList.add('hidden');
        }, 3000);
    }
    const keyMatrix = createKeyMatrix(key);
    const encryptedText = hillEncrypt(plaintext, keyMatrix);
    document.getElementById('result').innerText = `Encrypted Text: ${encryptedText}`;
    sucess.classList.remove('hidden');
    sucess.classList.add('slide-in');
    setTimeout(function() {
        sucess.classList.add('hidden');
    }, 3000);
});

document.getElementById('decryptBtn').addEventListener('click', () => {
    const key = document.getElementById('key').value;
    const ciphertext = document.getElementById('plaintext').value.toUpperCase();
    const keyMatrix = createKeyMatrix(key);
    const decryptedText = hillDecrypt(ciphertext, keyMatrix);
    document.getElementById('result').innerText = `Decrypted Text: ${decryptedText}`;
    sucess.classList.remove('hidden');
    sucess.classList.add('slide-in');
    setTimeout(function() {
        sucess.classList.add('hidden');
    }, 3000);
});
