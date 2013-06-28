class Town():
    """Town"""
    def __init__(self, id):
        self.__id = id
        self.__edges = {}

    def addOrUpdateEdge(self, destinationID, distance):
        self.__edges[destinationID] = distance

    def deleteEdge(self, destinationID):
        if destinationID not in self.__edges.keys():
            raise Exception('The to-be-deleted edge does not exist.')
        del self.__edges[destinationID]

    # getters
    def id(self):
        return self.__id

    def isConnectTo(self, destinationID):
        return destinationID in self.__edges.keys()

    def distanceTo(self, destinationID):
        return self.__edges[destinationID]

    def connectedTowns(self):
        return self.__edges.keys()

    def __repr__(self):
        rep = 'Town: ' + self.__id + '\n'
        for destinationID, distance in self.__edges.iteritems():
            rep += 'Edge:  ' + self.__id + '->' + destinationID + ' with a weight of ' + str(distance) + '\n'
        return rep

    # operator overloading
    # ==
    def __eq__(self, other):
        if isinstance(other, basestring):
            return self.__id == other
        elif isinstance(other, Town):
            return self.__id == other.__id
        else:
            raise Exception('Can only compare Town to another Town or an ID.')

    # !=
    def __ne__(self, other):
        if isinstance(other, basestring):
            return self.__id != other
        elif isinstance(other, Town):
            return self.__id != other.__id
        else:
            raise Exception('Can only compare Town to another Town or an ID.')
