// ==UserScript==
// @name         draftsim.org Draw Simulator
// @namespace    http://example.com/
// @version      0.1
// @description  Draw a hand from your drafted deck on draftsim.org
// @author       kainkordian
// @match        https://*.draftsim.com/draft.php?mode=*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==



$(document).ready(function() {
    'use strict';
    var deck_dictionary = {};
    var library = [];
    var current_library = [];

    function range(start,stop,step) {
        var a = [];
        if (stop === undefined) {
            stop = start;
            start = 0;
        }
        if (step === undefined) {
            step = 1;
        }
        for (; start < stop; start += step) {
            a.push(start);
        }
        return a;
    }

    function shuffle_array(a) {
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i+1));
            var temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
    }

    function display_new_hand(){
        shuffle_array(library);
        current_library = library.slice();

        var hand_container = document.getElementById("hand_container");
        if (!(hand_container === null)) {
            hand_container.parentNode.removeChild(hand_container);
        }

        hand_container = document.createElement("div");
        hand_container.setAttribute("id","hand_container");
        hand_container.setAttribute("class", "display");
        hand_container.innerHTML = '<p id="hand_title"><p>Your Hand:</p></p>';
        hand_container.innerHTML += '<p id="hand_img" class="display"></p>';

        var bottom_line = document.getElementById("bot_collection_container");
        bottom_line.parentNode.insertBefore(hand_container, bottom_line);

        var hand_img = document.getElementById("hand_img");
        var next_card;
        for(var i = 0; i<7; i++) {
            next_card = deck_dictionary[current_library.pop()]
            hand_img.appendChild(next_card);
        }

        // mulligan is currently not implemented
        document.getElementById("mulligan").style.display = "none";
        document.getElementById("next_card").style.display = "inline";
        document.getElementById("scry").style.display = "none";
    }

    function display_mulligan(){
        document.getElementById("mulligan").style.display = "none";
        document.getElementById("next_card").style.display = "none";
        document.getElementById("scry").style.display = "inline";
    }

    function display_scry(){
        document.getElementById("mulligan").style.display = "none";
        document.getElementById("next_card").style.display = "inline";
        document.getElementById("scry").style.display = "none";
    }

    function display_next_card(){
        if (current_library.length > 0) {
            var hand_img = document.getElementById("hand_img");
            var next_card = deck_dictionary[current_library.pop()];
            hand_img.insertBefore(next_card, hand_img.children[0]);
        }
        document.getElementById("mulligan").style.display = "none";
        document.getElementById("next_card").style.display = "inline";
        document.getElementById("scry").style.display = "none";
    }

    function get_deck_dictionary() {
        //TODO: DONT DELETE THIS ELEMENT FFS
        var card_sources_list = document.getElementById("deck_img").children;
        card_sources_list = Array.from(card_sources_list);
        card_sources_list = card_sources_list.slice();
        card_sources_list.map(function (elem) {elem.removeAttribute("id"); elem.removeAttribute("onclick")});
        var deck_dict = {};
        for(var i = 0; i < card_sources_list.length; i++) {
            deck_dict[i] = card_sources_list[i].cloneNode(false);
        }
        return deck_dict;
    }

    function add_draw_button(i){
        console.log(i);
        i = i + 1;
        var all_cards_picked = document.getElementById("pack_box").style.display === "none";
        var card_amount_in_deck = Number(document.getElementById("deck_title").childNodes[0].innerHTML.split(" ")[1]);
        var is_deck_complete = all_cards_picked && (card_amount_in_deck > 39);

        if (!is_deck_complete) {setTimeout(add_draw_button, 1000, i);}

        if (is_deck_complete) {
            var draw_button = document.createElement("ul");
            draw_button.setAttribute("id", "draw_buttons");
            draw_button.setAttribute("class", "commands");
            draw_button.innerHTML = '<br><li id="new_hand" class="after_draft" style="display: inline;"'
                                    + '>Draw New Hand</li>';
            draw_button.innerHTML += '<li id="mulligan" class="after_draft" style="display: none;"'
                                    + '>Mulligan</li>';
            draw_button.innerHTML += '<li id="scry" class="after_draft" style="display: none;"'
                                    + '>Scry</li>';
            draw_button.innerHTML += '<li id="next_card" class="after_draft" style="display: none;"'
                                    + '>Next Card</li><br><br>';

            deck_dictionary = get_deck_dictionary();
            library = range(card_amount_in_deck);


            var bottom_line = document.getElementById("bot_collection_container");
            bottom_line.parentNode.insertBefore(draw_button, bottom_line);
            var new_hand = document.getElementById("new_hand");
            new_hand.addEventListener("click", display_new_hand);
            var next_card = document.getElementById("next_card");
            next_card.addEventListener("click", display_next_card);
        }
    }

    add_draw_button(0);
});
