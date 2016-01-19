angular.module('myApp.tracker', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('tracker', {
    url: '/tracker',
    templateUrl: '/app/tracker/tracker.html'
  });
})

.controller('TrackerCtrl', function($scope, $state, TrackerFactory, Auth) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
      "November", "December"
  ];
  
  Auth.getUser()
    .success(function(result) {
      var user = result[0].githubID || null
      TrackerFactory
        .getJobs(user)
        .success(function(data) {
          console.log(data);
          $scope.jobs = data;
        })
      .error(function(err) {
        console.log('err', err);
      })
    })
    .error(function(err) {
      console.log(err);
    })

  var date = new Date();
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();


    $scope.updateRespond = function(job) {
      console.log(job);
      $('#updateRespond').openModal();
    }
    $scope.updatePhone = function(job) {
      if(!job.phone) {
        job.phone = true;
      } else {
        job.phone = false;
      }
      $scope.triggerJobUpdate(job);
      return job.phone;
    }

    $scope.edit = function(job) {
      console.log(job);
      job.editing = true;
    }

    $scope.doneEditing = function(job) {
      job.editing = false;

      $scope.triggerJobUpdate(job);
    }

    $scope.addJob = function(){
      $('#addJob').openModal();
    }
    $scope.updateJob = function(){
      var data = this.data;
    $('#updateJob').openModal();
      this.user = data;
    }

  $scope.save = function(user) {
    console.log(user);
    user.offer = 'not yet';
    user.date = day + ' ' + monthNames[monthIndex];
    user.phone = false;
    user.site = ' ';
    user.respond = 'Insert Date';
    user.show = true;
    user.editing = false;
    TrackerFactory
      .saveJob(user)
      .success(function(data) {
        $state.reload();
        $scope.user = {};
      })
      .error(function(err) {
        console.log(err);
      })
  };
  

  $scope.update = function(job) {
    $scope.data = job;
    $scope.updateJob();
  }

 $scope.triggerJobUpdate = function(job) {
   console.log('triiger update', job);
    TrackerFactory
      .updateJob(job)
      .success(function(data) {
        console.log(data);
      })
      .error(function(err) {
        console.log(err);
      })
 }

  $scope.updateRespondData = function(job) {
    console.log(job);
    $scope.triggerJobUpdate(job);
  }

  $scope.remove = function(job) {
    console.log(job);
    job.show = false;
    TrackerFactory
      .removeJob(job)
      .success(function(data) {
        console.log(data);
      })
      .error(function(err) {
        console.log(err);
      })
  }
  $scope.reset = function() {
    $scope.user = null;
  }
})
