class Spot {
  const Spot({
    required this.id,
    required this.name,
    required this.address,
    required this.imageAsset,
    required this.rating,
    required this.walkLabel,
    this.tags = const [],
    this.isFavorite = false,
  });

  final String id;
  final String name;
  final String address;
  final String imageAsset;
  final double rating;
  final String walkLabel;
  final List<String> tags;
  final bool isFavorite;

  Spot copyWith({bool? isFavorite}) {
    return Spot(
      id: id,
      name: name,
      address: address,
      imageAsset: imageAsset,
      rating: rating,
      walkLabel: walkLabel,
      tags: tags,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }
}
