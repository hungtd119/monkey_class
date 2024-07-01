import React from "react";
import MaterialItem, { TMaterialItem } from "src/components/MaterialItem";
import useTrans from "src/hooks/useTrans";

interface MaterialProps {
  titleSection: string;
  isSectionHLVD?: boolean;
  dataMaterial: TMaterialItem[];
  expanded: boolean;
  onToggle: () => void;
}

const SectionMaterialItem = (props: MaterialProps) => {
  const { titleSection, dataMaterial, expanded, onToggle, isSectionHLVD } = props;
  const trans = useTrans();

  return (
    <>
      <div className="material-header d-flex justify-content-between">
        <p className="mb-4 material__title">{trans.titleSectionMaterial[titleSection]}</p>
        <i
          className={`fa ${
            expanded ? "fa-angle-up" : "fa-angle-down"
          } fs-5 pointer`}
          aria-hidden="true"
          onClick={onToggle}
        />
      </div>

      {expanded && (
        <div className="row">
          <div className="col-md-12 material-wrapper d-flex flex-wrap gap-2">
            {(dataMaterial || []).map((lesson: any) => {
                if(lesson.links.length > 0) {
                    return (
                      <MaterialItem
                        key={lesson.id}
                        data={lesson}
                      />
                    );
                }
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default SectionMaterialItem;
