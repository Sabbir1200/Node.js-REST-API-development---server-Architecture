import type { IncomingMessage, ServerResponse } from "node:http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parseBody";
import { parse } from "node:path";
import { sendResponse } from "../utility/sendResponse";

export const productController = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  // console.log(req)
  const url = req.url;
  const method = req.method;

  const urlParts = url?.split("/");
  //   console.log(urlParts)
  const id =
    urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;
  // console.log(id)
  if (url === "/products" && method === "GET") {
    // const products = [
    //     {
    //         id: 1,
    //         name: "Product - 1"
    //     },
    // ]
    try {
      const products = readProduct();
      return sendResponse(
        res,
        200,
        true,
        "Products retrieve successfully",
        products,
      );
    } catch (error) {
      return sendResponse(
        res,
        500,
        false,
        "Products do not retrieve successfully",
        error,
      );
    }
  } else if (method === "GET" && id !== null) {
    try {
      const products = readProduct();
      const product = products.find((p: IProduct) => p.id === id);
      if (!product) {
        return sendResponse(res, 404, false, "Product not found");
      }
      return sendResponse(
        res,
        200,
        true,
        "Products retrieve successfully",
        products,
      );
    } catch (error) {
       return sendResponse(
        res,
        500,
        false,
        "Products do not retrieve successfully",
        error,
      );
    }
  } else if (method === "POST" && url === "/products") {
    // Created Products by Post Method
    const body = await parseBody(req);
    // console.log("Body",body);
    const products = readProduct();
    const newProduct = {
      id: Date.now(),
      ...body,
    };
    // console.log(newProduct)
    products.push(newProduct);
    insertProduct(products);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products created successfully",
        data: newProduct,
      }),
    );
  } else if ((method === "PUT" || method === "PATCH") && id !== null) {
    const body = await parseBody(req);
    const products = readProduct();

    const index = products.findIndex((p: IProduct) => p.id === id);
    // console.log(index)

    if (index < 0) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Products Not Found ",
          // data: newProduct,
        }),
      );
    }
    // console.log(products[index])
    products[index] = { id: products[index].id, ...body };
    insertProduct(products);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products Updated  successfully",
        data: products[index],
      }),
    );
  } else if (method === "DELETE" && id !== null) {
    const products = readProduct();
    const index = products.findIndex((p: IProduct) => p.id === id);

    if (index < 0) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Products Not Found ",
          // data: null,
        }),
      );
    }
    const deleted = products[index];
    products.splice(index, 1);
    // console.log(products)
    insertProduct(products);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products Delete successfully",
        // data: deleted,
      }),
    );
  }
};
