import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import $ from 'jquery';
import './sass/styles.scss';
import { getDoctorList, Doctor, Practice } from './lookup';


$(document).ready(function() {

  $("#doctor-search").submit(function(event) {
    event.preventDefault();
    $("#docs-in-area-list").empty();
    $(".no-result").hide();
    const cond = $("#condition").val();
    const name = $("#doctor").val();

    const promise = getDoctorList(name, cond);

    promise.then((response) => {
      const body = JSON.parse(response);
      const docList = body.data;
      docList.length === 0 ? $(".no-result").show() : true;

      docList.forEach((doc, index) => {
        const doctor = new Doctor(doc.profile.first_name, doc.profile.last_name, doc.profile.title);
        $("#docs-in-area-list").append(`<li id="doctor${index}">${doctor.display()}</li>`);

        doc.practices.forEach((practice) => {
          const pract = new Practice(practice.visit_address.street, practice.visit_address.city, practice.visit_address.state, practice.visit_address.zip, practice.phones[0].number);
          practice.website ? pract["web"] = `<a href="${practice.website}">${practice.website}</a>` : pract["web"] = "";
          practice.visit_address.street2 ? pract["street2"] = practice.visit_address.street2 : pract["street2"] = "";
          practice.accepts_new_patients ? pract["acceptsNew"] = `This office is accepting new patients.` : pract["acceptsNew"] = `This office is not accepting new patients at this time.`;
          $(`#doctor${index}`).append(`<div>${pract.display()}</div>`);
        });
      });
    });
  });
});
