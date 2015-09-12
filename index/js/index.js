(function() {
    
function main() {

    Promise.all([
        Utils.getJSON('static/document/projects.json'),
        Utils.getText('index/tpl/project.html')
    ])
    .then(function(results) {

        var projects = results[0];
        var template = results[1];

        // Compile templates
        var compiled = _.template(template);
        // output dom
        var resultHTML = '';

        // Process each project and append html
        projects.forEach(function(project) {

            resultHTML = resultHTML + compiled(project);

        });

        document.getElementById('projects-container').innerHTML = resultHTML;

    })

}

Utils.documentReady(main);

})();
