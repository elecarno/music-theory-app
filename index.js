var notes = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"]
var enharmonics = {
    "D♭": "C♯",
    "E♭": "D♯",
    "G♭": "F♯",
    "A♭": "G♯",
    "B♭": "A♯",

    "C♭": "B",
    "F♭": "E",
    
    "E♯": "F",
    "B♯": "C",


    "C♯": "D♭",
    "D♯": "E♭",
    "F♯": "G♭",
    "G♯": "A♭",
    "A♯": "B♭",

    "B": "C♭",
    "E": "F♭",

    "F": "E♯",
    "C": "B♯"
}

var ionian = {
    "C": ["C", "D", "E", "F", "G", "A", "B"],
    "G": ["G", "A", "B", "C", "D", "E", "F♯"],
    "D": ["D", "E", "F♯", "G", "A", "B", "C♯"],
    "A": ["A", "B", "C♯", "D", "E", "F♯", "G♯"],
    "E": ["E", "F♯", "G♯", "A", "B", "C♯", "D♯"],
    "B": ["B", "C♯", "D♯", "E", "F♯", "G♯", "A♯"],
    "F♯": ["F♯", "G♯", "A♯", "B", "C♯", "D♯", "E♯"],

    "G♭": ["G♭", "A♭", "B♭", "C♭", "D♭", "E♭", "F"],
    "D♭": ["D♭", "E♭", "F", "G♭", "A♭", "B♭", "C"],
    "A♭": ["A♭", "B♭", "C", "D♭", "E♭", "F", "G"],
    "E♭": ["E♭", "F", "G", "A♭", "B♭", "C", "D"],
    "B♭": ["B♭", "C", "D", "E♭", "F", "G", "A"],
    "F": ["F", "G", "A", "B♭", "C", "D", "E"],
}

var modes = {
    1: "Ionian",
    2: "Dorian",
    3: "Phrygian",
    4: "Lydian",
    5: "Mixolydian",
    6: "Aeolian",
    7: "Locrian"
}

const p_question = document.getElementById("question")
const a_input1 = document.getElementById("a-input-1")
const a_input2 = document.getElementById("a-input-2")
const a_input3 = document.getElementById("a-input-3")
const a_input4 = document.getElementById("a-input-4")
const a_input5 = document.getElementById("a-input-5")
const a_input6 = document.getElementById("a-input-6")
const a_input7 = document.getElementById("a-input-7")

function create_mode(root, mode) {
    var root_scale = []
    for (const [key, value] of Object.entries(ionian)) {
        if (value[mode-1] == root){
            root_scale = value
        }

        if (value[mode-1] == enharmonics[root]) {
            root_scale = value
            root = enharmonics[root]
        }
    }
    var mode_scale = root_scale.slice(mode-1).concat(root_scale.slice(0, mode-1));
    return mode_scale
}

function create_harm_minor(root) {
    var nat_minor = create_mode(root, 6)

    var sharp_7th = nat_minor[6] + "♯"
    if (sharp_7th == "E♯") {
        sharp_7th = "F"
    }
    if (sharp_7th == "B♯") {
        sharp_7th = "C"
    }

    var harm_minor = nat_minor.splice(7, 1)
    harm_minor.append(sharp_7th)

    return harm_minor

}

function list_modes() {
    document.getElementById("p_modes")

    var idx = 1
    for (i = 0; i < notes.length; i++){
        for (let mode = 1; mode < 8; mode++) {
            var created_mode = create_mode(notes[i], mode)
            var str = "\n" + idx + ": " + created_mode[0] + " " + modes[mode] + ": " + created_mode
            const p_modes = document.createElement("p")
            const text = document.createTextNode(str)
            p_modes.appendChild(text)
            document.getElementById("p_div").appendChild(p_modes)
            idx++;
        }
    }
}

var answer

document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll(".a-input");

    inputs.forEach((input, index) => {
        input.addEventListener("input", (event) => {
            let value = event.target.value;
            let nextInput = inputs[index + 1];

            if (value.length === 1) {
                if (/^[A-G]$/.test(value)) {
                    event.target.dataset.letter = value;
                } else {
                    event.target.value = "";
                }
            } else if (value.length === 2) {
                const firstChar = value[0];
                let secondChar = value[1];

                if (secondChar === "#") secondChar = "♯";
                if (secondChar === "b") secondChar = "♭";

                if (secondChar === "♯" || secondChar === "♭") {
                    event.target.value = firstChar + secondChar;
                    if (nextInput) nextInput.focus();
                } else if (/^[A-G]$/.test(secondChar)) {
                    event.target.value = firstChar;
                    if (nextInput) {
                        nextInput.value = secondChar;
                        nextInput.focus();
                    }
                } else {
                    event.target.value = firstChar;
                }
            }
        });

        input.addEventListener("keydown", (event) => {
            if (event.key === "Backspace" && input.value === "" && index > 0) {
                event.preventDefault();
                const prevInput = inputs[index - 1];
                prevInput.focus();
                setTimeout(() => prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length), 0);
            }

            if (event.key === "Enter") {
                checkInputs();
            }
        });
    });

    function checkInputs() {
        let userInputs = Array.from(inputs).map(input => input.value.trim());
        if (userInputs.includes("")) {
            alert("All inputs must be filled!");
            return;
        }

        let isCorrect = userInputs.every((val, i) => val === answer[i]);
        alert(isCorrect ? "Correct!" : "Incorrect. Answer was " + answer);
    }
});

function set_question() {
    var root = notes[Math.floor(Math.random()*notes.length)];
    var mode = Math.floor(Math.random() * 7) + 1;
    answer = create_mode(root, mode)

    p_question.textContent = answer[0] + " " + modes[mode]
}

set_question()