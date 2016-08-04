(function() {
  // Setup the shell
  var cliHistory = new Josh.History();
  var shell = Josh.Shell({history: cliHistory});
  // window.shell = Josh.Shell({history: cliHistory});

  // Configure prompt
  shell.onNewPrompt(function(callback) {
    callback("$");
  });

  // Pathhandler
  var pathhandler = new Josh.PathHandler(shell);
  var root = {
    name: "",
    path: "/",
    childnodes: [],
    children: []
  };
  var resume = {
    name: "resume.md",
    path: "/resume.md",
    content: "hello world",
    childnodes: [],
    children: [],
    parent: root
  }
  root.childnodes.push(resume);
  root.children.push(resume.name);
  pathhandler.current = root;
  pathhandler.getNode = function(path, callback) {
    if(!path) {
      return callback(pathhandler.current);
    }
    var parts = _.filter(path.split('/'), function(x) {
      return x;
    });
    var start = ((path || '')[0] == '/') ? treeroot : pathhandler.current;
    return findNode(start, parts, callback);
  };
  pathhandler.getChildNodes = function(node, callback) {
    callback(node.childnodes);
  };
  function findNode(current, parts, callback) {
    if(!parts || parts.length == 0) {
      return callback(current);
    }
    if(parts[0] == ".") {

    } else if(parts[0] == "..") {
      current = current.parent;
    } else {
      current = _.first(_.filter(current.childnodes, function(node) {
        return node.name == parts[0];
      }));
    }
    if(!current) {
      return callback();
    }
    return findNode(current, _.rest(parts), callback);
  }

  // Custom commands
  shell.setCommandHandler("hello", {
    exec: function(cmd, args, callback) {
      var arg = args[0] || '';
      var response = "who is this " + arg + " you are talking to?";
      if(arg === 'josh') {
          response = 'pleased to meet you.';
      } else if(arg === 'world') {
          response = 'world says hi.'
      } else if(!arg) {
          response = 'who are you saying hello to?';
      }
      callback(response);
    },
    completion: function(cmd, arg, line, callback) {
      callback(shell.bestMatch(arg, ['world', 'josh']))
    }
  });

  // Start the shell
  shell.activate();
}).call(this)
