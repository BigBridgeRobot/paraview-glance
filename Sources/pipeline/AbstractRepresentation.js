import macro from 'vtk.js/Sources/macro';

// ----------------------------------------------------------------------------

function connectMapper(mapper, input) {
  const source = input.getSource();
  if (source) {
    mapper.setInputConnection(source.getOutputPort());
  } else {
    mapper.setInputData(input.getDataset());
  }
}

// ----------------------------------------------------------------------------
// vtkAbstractRepresentation methods
// ----------------------------------------------------------------------------

function vtkAbstractRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkAbstractRepresentation');

  publicAPI.setInput = (source) => {
    model.input = source;
  };

  publicAPI.getInputDataSet = () => model.input.getDataset();

  publicAPI.isSourceRepresentation = (id) => model.input.getProxyId() === id;

  publicAPI.isVisible = () => {
    if (model.actors.length) {
      return model.actors[0].getVisibility();
    }
    if (model.volumes.length) {
      return model.volumes[0].getVisibility();
    }
    return false;
  };

  publicAPI.setVisibility = (visible) => {
    let count = model.actors.length;
    while (count--) {
      model.actors[count].setVisibility(visible);
    }
    count = model.volumes.length;
    while (count--) {
      model.volumes[count].setVisibility(visible);
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  actors: [],
  volumes: [],
  sectionName: 'representation',
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, ['input', 'actors', 'volumes']);

  // Object specific methods
  vtkAbstractRepresentation(publicAPI, model);
}

export default { extend, connectMapper };
