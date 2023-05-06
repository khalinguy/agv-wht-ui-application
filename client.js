console.log('Client-side code running');

$(document).ready(function () {
    $("#changeset").click(function () {
       $.post("/login",
          {
             name: "viSion",
             designation: "Professional gamer"
          },
          function (data, status) {
             console.log(data);
          });
    });
 });