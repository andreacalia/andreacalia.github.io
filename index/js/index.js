(function() {

function main() {

    Promise.all([
        Utils.getJSON('static/document/projects.json'),
        Utils.getJSON('static/document/about.json'),
        Utils.getText('index/tpl/project.html'),
        Utils.getText('index/tpl/about.html')
    ])
    .then(function(results) {

        var projects = results[0];
        var about = results[1];
        var projectTemplate = results[2];
        var aboutTemplate = results[3];

        // Compile templates
        var projectTemplateCompiled = _.template(projectTemplate);
        var aboutTemplateCompiled = _.template(aboutTemplate);

        // output dom
        var projectsHTML = _.reduce(projects, function(html, data) { return html + projectTemplateCompiled(data); }, '');
        var aboutHTML = aboutTemplateCompiled(about);

        document.getElementById('about-container').innerHTML = aboutHTML;
        document.getElementById('projects-container').innerHTML = projectsHTML;
    });

}

Utils.documentReady(main);

})();
