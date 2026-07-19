export const getAutomatedWeb3Data = async () => {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=194");
    const data = await response.json();

    const allowedCategories = [
      "mens-shirts", "mens-shoes", "mens-watches",
      "womens-dresses", "womens-shoes", "womens-watches",
      "womens-bags", "womens-jewellery", "sunglasses", "tops",
    ];

    let finalProducts = [];

    // Loop through each category to ensure we get 10 items for each
    for (const cat of allowedCategories) {
      const itemsInCategory = data.products.filter(item => item.category === cat);
      
      // Take the first 10 items (or all available if less than 10)
      const tenItems = itemsInCategory.slice(0, 10);
      
      const formattedItems = tenItems.map((item, index) => ({
        id: item.id,
        name: item.title,
        price: `$${item.price.toFixed(2)}`,
        ethPrice: `${(item.price / 3000).toFixed(4)} ETH`,
        category: item.category.replace("-", " ").toUpperCase(),
        img: item.images[0] || item.thumbnail,
        tokenId: `0x7a2${(index + 1000).toString(16)}...${item.id}f`,
        isMinted: true, 
      }));

      finalProducts = [...finalProducts, ...formattedItems];
    }

    return finalProducts;
  } catch (error) {
    console.error("Data automation failed:", error);
    return [];
  }
};