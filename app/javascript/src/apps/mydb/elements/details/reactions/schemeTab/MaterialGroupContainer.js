import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { DragDropItemTypes } from 'src/utilities/DndConst';
import { MaterialGroup } from 'src/apps/mydb/elements/details/reactions/schemeTab/MaterialGroup';
import Reaction from 'src/models/Reaction';


const target = {
  drop(tagProps, monitor) {
    const { dropSample, dropMaterial } = tagProps;
    const srcItem = monitor.getItem();
    const srcType = monitor.getItemType();
    if (srcType === DragDropItemTypes.SAMPLE) {
      dropSample(
        srcItem.element,
        tagProps.material,
        tagProps.materialGroup,
      );
    } else if (srcType === DragDropItemTypes.MOLECULE) {
      dropSample(
        srcItem.element,
        tagProps.material,
        tagProps.materialGroup,
        null,
        true,
      );
    } else if (srcType === DragDropItemTypes.MATERIAL) {
      dropMaterial(
        srcItem.material,
        srcItem.materialGroup,
        tagProps.material,
        tagProps.materialGroup,
      );
    }
  },
  canDrop(tagProps, monitor) {
    const srcType = monitor.getItemType();
    const isCorrectType = srcType === DragDropItemTypes.MATERIAL
      || srcType === DragDropItemTypes.SAMPLE
      || srcType === DragDropItemTypes.MOLECULE;
    const noMaterial = tagProps.materials.length === 0;
    return noMaterial && isCorrectType;
  },
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
});

class MaterialGroupContainer extends Component {
  render() {
    const {
      materials, materialGroup, showLoadingColumn, headIndex,
      isOver, canDrop, connectDropTarget,
      deleteMaterial, onChange, reaction, dropSample, dropMaterial, switchEquiv, lockEquivColumn,
      displayYieldField, switchYield,
    } = this.props;
    let className='';
    if (canDrop) {
      className+=' dnd-zone';
      if (isOver) {
        className+=' dnd-zone-over';
      }
    }

    return connectDropTarget(
      <div className={className}>
        <MaterialGroup
          reaction={reaction}
          onChange={onChange}
          materials={materials}
          materialGroup={materialGroup}
          showLoadingColumn={showLoadingColumn}
          deleteMaterial={deleteMaterial}
          addDefaultSolvent={dropSample}
          dropSample={dropSample}
          dropMaterial={dropMaterial}
          headIndex={headIndex}
          switchEquiv={switchEquiv}
          lockEquivColumn={lockEquivColumn}
          displayYieldField={displayYieldField}
          switchYield={switchYield}
        />
      </div>
    );
  }
}

export default DropTarget(
  [DragDropItemTypes.SAMPLE, DragDropItemTypes.MOLECULE, DragDropItemTypes.MATERIAL],
  target,
  collect,
)(MaterialGroupContainer);

MaterialGroupContainer.propTypes = {
  materials: PropTypes.arrayOf(PropTypes.shape).isRequired,
  headIndex: PropTypes.number.isRequired,
  materialGroup: PropTypes.string.isRequired,
  deleteMaterial: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  dropSample: PropTypes.func.isRequired,
  dropMaterial: PropTypes.func.isRequired,
  reaction: PropTypes.instanceOf(Reaction).isRequired,
  showLoadingColumn: PropTypes.bool,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  switchEquiv: PropTypes.func,
  lockEquivColumn: PropTypes.bool,
  displayYieldField: PropTypes.bool.isRequired,
  switchYield: PropTypes.func.isRequired,
};

MaterialGroupContainer.defaultProps = {
  showLoadingColumn: false,
  switchEquiv: () => null,
  lockEquivColumn: false
};
