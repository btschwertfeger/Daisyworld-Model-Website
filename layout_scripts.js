/*
########################################
## @author Benjamin Thomas Schwertfeger
############
*/



/* GENERAL VARIABLES*/
let dw_sliders = document.getElementsByName("dw_slider");
let dw_variabels = ['alb_white', 'alb_black', 'alb_barren', 'insul', 'drate', 'optTw', 'optTb', 'Sflux_min', 'Sflux_max', 'Sflux_step'];


/* RESET BUTTON  */
let resetBtn = document.getElementById('resetBtn');
resetBtn.onclick = function () {
    window.updatePlots(); // resets the plots
    dw_sliders.forEach((element, index) => {
        let default_value = window.default_parameters[dw_variabels[index]];
        document.getElementById(element.id).value = default_value;
        document.getElementById(dw_variabels[index] + '_sliderAmount').innerHTML = default_value;
    });
    document.getElementById('KELVIN_OFFSET').value = 273.15;
}

/* SLIDER  */
for (let entry = 0; entry < dw_sliders.length; entry++) {
    dw_sliders[entry].oninput = function () {
        document.getElementById(dw_sliders[entry].id + 'rAmount').innerHTML = document.getElementById(dw_sliders[entry].id).value;
    }
    dw_sliders[entry].onchange = function () {
        window.updatePlots({
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
            KELVIN_OFFSET: document.getElementById('KELVIN_OFFSET').value,
        })
    }
}
/* REVERSE AND KELVIN INPUT */
let SOMEGOODVARIABLENAME = ['showWhiteDinc-checkbox', 'showBlackDinc-checkbox',
    'showWhiteDdec-checkbox', 'showBlackDdec-checkbox',
    'showTotalAmountD4incL-checkbox', 'showTotalAmountD4decL-checkbox',
    'showglobTinc-checkbox', 'showglobTdec-checkbox',
    'showTempWithoutLife-checkbox', 'KELVIN_OFFSET'
];
SOMEGOODVARIABLENAME.forEach(function (entry, index) {
    document.getElementById(entry).onchange = function () {
        window.updatePlots({
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
            KELVIN_OFFSET: document.getElementById('KELVIN_OFFSET').value,
        });
    }
});