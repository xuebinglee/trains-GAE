function ajaxAddTown(townID) {
  $.ajax({
    url: '/Town/Add',
    data: {
      townID: townID
    },
    type: 'POST',
    dataType: 'text',
    success: function( response ) {
      $('#Graph').text(response);
    },
    error: function( xhr, status ) {
      alert('Failed to connect to server!\n' +
            'xhr: ' + xhr + '\n' +
            'status: ' + status);
    },
    complete: function( xhr, status ) {
      console.log('POST Town '+townID+' to /Town/Add');
    }
  });
}
