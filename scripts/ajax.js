function ajaxAddTown(townID) {
  $.ajaxQueue({
    url: '/Town/Add',
    data: {
      townID: townID
    },
    type: 'POST',
    dataType: 'text',
    success: function(response) {
      $('#Graph').html(response.replace(/ /g,"&nbsp;").replace(/\r?\n/g, '<br />'));
    },
    error: function(xhr, status) {
      alert('Failed to connect to server!\n' +
            'xhr: ' + xhr + '\n' +
            'status: ' + status);
    },
    complete: function(xhr, status) {
      console.log('POST Town '+townID+' to /Town/Add');
    }
  });
}

function ajaxDeleteTown(townID) {
  $.ajaxQueue({
    url: '/Town/Delete',
    data: {
      townID: townID
    },
    type: 'POST',
    dataType: 'text',
    success: function(response) {
      $('#Graph').html(response.replace(/ /g,"&nbsp;").replace(/\r?\n/g, '<br />'));
    },
    error: function(xhr, status) {
      alert('Failed to connect to server!\n' +
            'xhr: ' + xhr + '\n' +
            'status: ' + status);
    },
    complete: function(xhr, status) {
      console.log('POST Town '+townID+' to /Town/Delete');
    }
  });
}

function ajaxAddEdge(originID, destinationID, distance) {
  $.ajaxQueue({
    url: '/Edge/Add',
    data: {
      originID: originID,
      destinationID: destinationID,
      distance: distance
    },
    type: 'POST',
    dataType: 'text',
    success: function(response) {
      $('#Graph').html(response.replace(/ /g,"&nbsp;").replace(/\r?\n/g, '<br />'));
    },
    error: function(xhr, status) {
      alert('Failed to connect to server!\n' +
            'xhr: ' + xhr + '\n' +
            'status: ' + status);
    },
    complete: function(xhr, status) {
      console.log('POST '+originID+'->'+destinationID+' '+distance+' to /Edge/Add');
    }
  });
}
var ajaxUpdateEdge = ajaxAddEdge;

function ajaxDeleteEdge(originID, destinationID) {
  $.ajaxQueue({
    url: '/Edge/Delete',
    data: {
      originID: originID,
      destinationID: destinationID
    },
    type: 'POST',
    dataType: 'text',
    success: function(response) {
      $('#Graph').html(response.replace(/ /g,"&nbsp;").replace(/\r?\n/g, '<br />'));
    },
    error: function(xhr, status) {
      alert('Failed to connect to server!\n' +
            'xhr: ' + xhr + '\n' +
            'status: ' + status);
    },
    complete: function(xhr, status) {
      console.log('POST '+originID+'->'+destinationID+' to /Edge/Delete');
    }
  });
}

// a modified version of http://stackoverflow.com/questions/1964839/jquery-please-wait-loading-animation
$(document).on({
    ajaxStart: function() {
        $("body").addClass("loading");
    },
    ajaxStop: function() {
        $("body").removeClass("loading");
    }
});
