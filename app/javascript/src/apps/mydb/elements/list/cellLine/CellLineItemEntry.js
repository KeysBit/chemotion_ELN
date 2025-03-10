import React, { Component } from 'react';
import UIStore from 'src/stores/alt/stores/UIStore';
import { Table } from 'react-bootstrap';
import ElementCheckbox from 'src/apps/mydb/elements/list/ElementCheckbox';
import ElementContainer from 'src/apps/mydb/elements/list/ElementContainer';
import { elementShowOrNew } from 'src/utilities/routesUtils';
import { DragDropItemTypes } from 'src/utilities/DndConst';
import Aviator from 'aviator';
import ElementCollectionLabels from 'src/apps/mydb/elements/labels/ElementCollectionLabels';
import { CellLinePropTypeTableEntry } from 'src/models/cellLine/CellLinePropTypes';
import ElementStore from 'src/stores/alt/stores/ElementStore';

export default class CellLineItemEntry extends Component {
  constructor(props) {
    super(props);
    this.showDetails = this.showDetails.bind(this);
  }

  showDetails() {
    const { currentCollection, isSync } = UIStore.getState();
    const { cellLineItem } = this.props;
    const { id, type } = cellLineItem;

    const uri = isSync
      ? `/scollection/${currentCollection.id}/${type}/${id}`
      : `/collection/${currentCollection.id}/${type}/${id}`;
    Aviator.navigate(uri, { silent: true });
    const e = {
      type,
      params: {
        collectionID: currentCollection.id,
        new_cellLine: false,
        cellLineId: id
      }
    };
    e.params[`${type}ID`] = id;

    elementShowOrNew(e);
  }

  // eslint-disable-next-line class-methods-use-this
  isElementChecked(element) {
    const { checkedIds = [], uncheckedIds = [], checkedAll } = UIStore.getState().cell_line;
    return (checkedAll && !uncheckedIds.includes(element.id)) || checkedIds.includes(element.id);
  }

  render() {
    const { cellLineItem } = this.props;
    const { currentElement } = ElementStore.getState();
    const backgroundColorClass = currentElement?.id === cellLineItem.id ? 'text-bg-primary' : '';

    return (
      <div className="group-entry">
        <Table className="elements" hover>
          <tbody>
            <tr className={`${backgroundColorClass} border-top`}>
              <td className="select-checkBox">
                <ElementCheckbox
                  element={cellLineItem}
                  checked={this.isElementChecked(cellLineItem)}
                />
              </td>
              <td
                className="short_label"
                onClick={this.showDetails}
              >
                {cellLineItem.short_label}
              </td>
              <td
                className="item-text"
                onClick={this.showDetails}
              >
                <div>
                  <div className="item-properties floating">
                    <div className="starting floating item-property-value">
                      {cellLineItem.itemName}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <ElementCollectionLabels element={cellLineItem} />
              </td>
              <td className="arrow">
                <ElementContainer
                  sourceType={DragDropItemTypes.CELL_LINE}
                  element={cellLineItem}
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

CellLineItemEntry.propTypes = {
  cellLineItem: CellLinePropTypeTableEntry.isRequired
};
