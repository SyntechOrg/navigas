import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { fetchCarById } from "./carService";

/**
 * Temporary redirect: /api/cars/:id  →  /fahrzeuge/:slug
 * Fetches the car by documentId, reads its slug, and redirects.
 * Can be removed once old links are no longer in circulation.
 */
const OldCarRedirect = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [slug, setSlug] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchCarById(id)
      .then((car) => {
        if (car?.slug) {
          setSlug(car.slug);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, [id]);

  if (error) return <div className="text-center py-20 text-xl text-red-600">Car not found</div>;
  if (!slug) return <div className="text-center py-20 text-xl">Redirecting...</div>;

  const pricing = searchParams.get("pricing");
  const target = `/fahrzeuge/${slug}${pricing ? `?pricing=${pricing}` : ""}`;
  return <Navigate to={target} replace />;
};

export default OldCarRedirect;
