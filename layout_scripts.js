/*
########################################
## @author Benjamin Thomas Schwertfeger (June 2021)
############
*/

/* GENERAL VARIABLES*/
const DE_SLIDERS = document.getElementsByName("dw_slider"),
    dw_variabels = ['alb_white', 'alb_black', 'alb_barren', 'insul',
        'drate', 'optTw', 'optTb', 'Sflux_min', 'Sflux_max', 'Sflux_step'
    ];


/* RESET BUTTON  */
const RESET_BTN = document.getElementById('resetBtn');
RESET_BTN.onclick = function () {
    window.createPlots(); // resets the plots
    DE_SLIDERS.forEach((element, index) => {
        let default_value = window.default_parameters[dw_variabels[index]];
        document.getElementById(element.id).value = default_value;
        document.getElementById(dw_variabels[index] + '_sliderAmount').innerHTML = default_value;
    });
}

/* SLIDER  */
for (let entry = 0; entry < DE_SLIDERS.length; entry++) {
    DE_SLIDERS[entry].oninput = function () {
        document.getElementById(DE_SLIDERS[entry].id + 'rAmount').innerHTML = document.getElementById(DE_SLIDERS[entry].id).value;
    }
    DE_SLIDERS[entry].onchange = function () {
        window.createPlots({
            alb_white: document.getElementById('alb_white_slide').value,
            alb_black: document.getElementById('alb_black_slide').value,
            alb_barren: document.getElementById('alb_barren_slide').value,
            insul: document.getElementById('insul_slide').value,
            drate: document.getElementById('drate_slide').value,
            optTw: document.getElementById('optTw_slide').value,
            optTb: document.getElementById('optTb_slide').value,
            Sflux_min: document.getElementById('Sflux_min_slide').value,
            Sflux_max: document.getElementById('Sflux_max_slide').value,
            Sflux_step: document.getElementById('Sflux_step_slide').value,
        })
    }
}

window.areaPlot_checkboxes.forEach(function (entry) {
    document.getElementById(entry).onchange = function () {
        window.updatePlot("area");
    }
});

window.tempPlot_checkboxes.forEach(function (entry) {
    document.getElementById(entry).onchange = function () {
        window.updatePlot("temp");
    }
});