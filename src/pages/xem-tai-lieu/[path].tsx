import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import useHeightScreen from "src/hooks/useHeightScreen";

const titlePage = "Monkey Class -  Xem tài liệu";

const XemTaiLieu = () => {

  const router = useRouter();
  const { path } = router.query;

  const decodedPath = path ? decodeURIComponent(path as string) : "";

  const docs = [
    {
      uri: decodedPath,
    },
  ];


  return (
    <>
    <Head>
        <title>{titlePage}</title>
        <meta name="description" content="Học liệu" />
      </Head>
      <DocViewer
        pluginRenderers={DocViewerRenderers}
        documents={docs}
        config={{
          header: {
            disableHeader: false,
            disableFileName: true,
            retainURLParams: true,
          },
          pdfVerticalScrollByDefault: true, // false as default
        }}
        className="remove-scroll-docs-view rounded"
        style={{ height: `${useHeightScreen() - 40}px` }}
      />
    </>
  );
};

export default XemTaiLieu;
