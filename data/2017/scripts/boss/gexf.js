const {UndirectedGraph} = require('graphology'),
      gexf = require('graphology-gexf'),
      forceAtlas2 = require('graphology-layout-forceatlas2'),
      layout = require('graphology-layout'),
      fs = require('fs'),
      _ = require('lodash');

const PROJECTS = require('./projects.json'),
      STUDENTS = require('./students.json');

const bipartite = new UndirectedGraph(),
      monopartite = new UndirectedGraph();

STUDENTS.forEach(student => {
  student.type = 'student';
  student.label = `${student.firstName} ${student.name}`;
  student.color = '#ccc';
  bipartite.addNode(student.id, student);
  monopartite.addNode(student.id, student);
});

PROJECTS.forEach(project => {
  project.type = 'project';
  project.label = project.name;
  project.color = '#ccc';
  bipartite.addNode(project.id, _.omit(project, 'team'));

  project.team.forEach((student, i) => {
    if (bipartite.hasNode(student))
      bipartite.addEdge(project.id, student);

    project.team.slice(i).forEach(other => {
      if (bipartite.hasNode(other))
        monopartite.mergeEdge(student, other);
    });
  });
});

// layout.random.assign(monopartite);
// forceAtlas2.assign(monopartite, {iterations: 50});

// const degreeSize = graph => {
//   graph.nodes().forEach(node => (graph.setNodeAttribute(node, 'size', graph.degree(node))));
// };

// degreeSize(monopartite);

fs.writeFileSync('bipartite.gexf', gexf.write(bipartite));
fs.writeFileSync('monopartite.gexf', gexf.write(monopartite));
