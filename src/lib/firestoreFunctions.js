
export const sortBy = async (countryCode) => {
  db.collection("Allowed")
    .where("country", "==", countryCode)
    .orderBy("storeID")
    .get()
    .then((querySnapshot) => {
      // This will return all documents that have "country" == "SE"
    })
  }