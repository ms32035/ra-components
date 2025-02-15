import React, { useState } from "react";
import { JSONTree } from "react-json-tree";
import { Button } from "@mui/material";
import { FunctionField, useRecordContext, useTranslate } from "react-admin";

const ViewJSON = (JsonObj, treeview, expandview, rest) => {
  if (JsonObj === JSON.stringify({})) return "";
  if (JsonObj && typeof JsonObj === "object")
    return treeview ? (
      <JSONTree
        data={JsonObj}
        hideRoot
        shouldExpandNode={() => expandview}
        {...rest}
      />
    ) : (
      JSON.stringify(JsonObj).replaceAll(/([{},:])/g, " $1 ")
    );
  return "";
};

const GetJSON = (record, source) => {
  const sources =
    record && source === `ALL` ? Object.keys(record) : source.split(`,`);
  const retval = {};
  for (let i = 0; i < sources.length; i++)
    retval[sources[i]] = record[sources[i]];
  return retval;
};

/**
 *
 * Your JSON can be viewed in a tree structure using `JsonField`.
 *
 * @example
 *  <JsonField source='config' label='JSON Config' />
 *
 * You can also set JSON text directly instead of using source prop.
 * @example
 * <JsonField json={jsonobj} label='JSON Object' />
 *
 * If `treeview` is `false`, JSON is viewed as text, i.e., tweaked to add enough spaces so that it fits the screen.
 * @example
 * <JsonField json={jsonobj} label='JSON Object' treeview={false}/>
 *
 * Also, if `togglelabel` is set, a button is shown additionally to toggle between `tree` and `text`.
 * @example
 * <JsonField json={jsonobj} label='JSON Object' togglelabel='Toggle-View'/>
 *
 * If `expandlabel` and `collapselabel` are set, a button is shown additionally to toggle between `expand` and `collapse`.
 * @example
 * <JsonField json={jsonobj} label='JSON Object' expandlabel='Expand' collapselabel='Collapse'/>
 */
export const JsonField = ({
  label,
  source,
  json,
  togglelabel,
  expandlabel,
  collapselabel,
  defaultExpand = true,
  treeview = true,
  ...rest
}) => {
  let treeBtn;
  let expandBtn;
  const [tree, setTree] = useState(treeview);
  const [expand, setExpand] = useState(defaultExpand);
  const record = useRecordContext();
  const translate = useTranslate();
  if (!record) return null;
  if (!json && !source)
    throw new Error(`Missing mandatory prop: json or source`);
  const data = json || GetJSON(record, source);
  if (!data) return null;
  if (tree && expandlabel && collapselabel)
    expandBtn = (
      <Button
        variant="contained"
        size="small"
        onClick={() => setExpand(!expand)}
      >
        {expand ? translate(collapselabel) : translate(expandlabel)}
      </Button>
    );

  if (treeview && togglelabel)
    treeBtn = (
      <Button variant="contained" size="small" onClick={() => setTree(!tree)}>
        {translate(togglelabel)}
      </Button>
    );

  const retVal = (
    <div>
      {label && translate(label)}&nbsp;&nbsp;{treeBtn}&nbsp;&nbsp;{expandBtn}
      {ViewJSON(data, tree, expand, rest)}
    </div>
  );
  return <FunctionField render={() => retVal} />;
};
