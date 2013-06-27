function ajaxAddTown(townID) {
  $.ajax({
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
  $.ajax({
    url: '/Town/Delete',
    //async: false,
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
  $.ajax({
    url: '/Edge/Add',
    //async: false,
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

function ajaxUpdateBothEdges(originID, destinationID, distance) {
  $.ajax({
    url: '/Edge/Update/Both',
    //async: false,
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

function ajaxDeleteEdge(originID, destinationID) {
  $.ajax({
    url: '/Edge/Delete',
    async: false,
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

function ajaxDeleteBothEdges(originID, destinationID) {
  $.ajax({
    url: '/Edge/Delete/Both',
    async: false,
    data: {
      originID: originID,
      destinationID: destinationID,
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
      console.log('POST '+originID+'->'+destinationID+' to /Edge/Delete/Both');
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
