import * as React from 'react';
import {Menu, MenuItem} from "./Menu";
import {Msg} from "./Msg";
import {Dispatcher} from "react-tea-cup";
import {ItemRenderer} from "./ItemRenderer";
import {menuId, Model} from "./Model";
import {stopEvent} from "../tea-popover/StopEvent";

export interface ViewMenuProps<T> {
  model: Model<T>;
  dispatch: Dispatcher<Msg<T>>;
  renderer: ItemRenderer<T>;
}

export function ViewMenu<T>(props: ViewMenuProps<T>) {
  const {model} = props;
  const {menu, state, uuid, windowSize} = model;
  if (uuid.type === 'Nothing') {
    return <></>;
  }
  if (windowSize.type === 'Nothing') {
    return <></>;
  }

  const renderItems = () => menu.elems.map((element, index) => {
    switch (element.tag) {
      case "item": {
        return (
            <ViewMenuItem
                key={`item-${index}`}
                menu={menu}
                item={element}
                {...props}
            />
        )
      }
      case "separator": {
        return (
            <div key={`sep-${index}`} className="tm--separator"/>
        )
      }
    }
  });

  switch (state.tag) {
    case "closed":
      return <></>;
    case "placing": {
      const {position} = state;
      return (
          <div
              className="tm-placer"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                overflow: "hidden",
              }}
              onContextMenu={stopEvent}
          >
            <div
                className="tm"
                id={menuId(uuid.value)}
                style={{
                  position: "absolute",
                  top: position.y,
                  left: position.x,
                  visibility: "hidden",
                }}
                onContextMenu={stopEvent}
            >
              {renderItems()}
            </div>
          </div>
      )
    }
    case "open": {
      const {box} = state;
      const {p, d} = box;
      return (
          <div
              className="tm"
              id={menuId(uuid.value)}
              style={{
                position: "absolute",
                top: p.y,
                left: p.x,
                width: d.w,
                height: d.h
              }}
              onContextMenu={stopEvent}
          >
            {renderItems()}
          </div>
      )
    }
  }
}

export interface ViewMenuItemProps<T> {
  menu: Menu<T>;
  item: MenuItem<T>;
  dispatch: Dispatcher<Msg<T>>;
  renderer: ItemRenderer<T>;
}

export function ViewMenuItem<T>(props: ViewMenuItemProps<T>) {
  const {menu, item, renderer, dispatch} = props;
  const selected = menu.isSelected(item);
  const selectedClass = selected ? ' tm-selected' : '';
  return (
      <div
          className={"tm--item" + selectedClass}
          onMouseEnter={() => dispatch({tag: 'mouse-enter', item})}
      >
        <div className="tm--item__content">
          {renderer(item.userData)}
        </div>
        {item.subMenu
            .map(subMenu =>
                <div className="tm--item__submenu-trigger">
                  ›
                </div>
            )
            .withDefaultSupply(() => <></>)
        }
      </div>
  );
}

