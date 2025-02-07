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

function init() {
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

init()